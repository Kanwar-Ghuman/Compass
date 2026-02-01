import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { sendEmail, generateItemApprovedEmail } from '@/lib/email'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        claims: {
          select: {
            id: true,
            claimType: true,
            status: true,
            createdAt: true,
          },
        },
      },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const item = await prisma.item.findUnique({
      where: { id },
    })

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}

    if (body.title) updateData.title = body.title
    if (body.category) updateData.category = body.category
    if (body.description) updateData.description = body.description
    if (body.foundLocation) updateData.foundLocation = body.foundLocation
    if (body.foundAt) updateData.foundAt = new Date(body.foundAt)
    if (body.status) updateData.status = body.status
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes
    if (body.rejectionReason !== undefined) updateData.rejectionReason = body.rejectionReason

    if (body.status === 'APPROVED' && item.status !== 'APPROVED') {
      updateData.approvedAt = new Date()
      updateData.approvedBy = body.approvedBy || 'admin'
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data: updateData,
    })

    // Send email notification when item is approved
    if (body.status === 'APPROVED' && item.status !== 'APPROVED' && item.reporterEmail) {
      const emailContent = generateItemApprovedEmail(item.title)
      await sendEmail({
        to: item.reporterEmail,
        toName: item.reporterName || undefined,
        subject: emailContent.subject,
        htmlContent: emailContent.htmlContent,
      })
    }

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.item.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
