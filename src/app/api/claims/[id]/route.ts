import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { sendEmail, generateClaimVerifiedEmail } from '@/lib/email'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        item: true,
      },
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(claim)
  } catch (error) {
    console.error('Error fetching claim:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claim' },
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

    const claim = await prisma.claim.findUnique({
      where: { id },
    })

    if (!claim) {
      return NextResponse.json(
        { error: 'Claim not found' },
        { status: 404 }
      )
    }

    const updateData: Record<string, unknown> = {}

    if (body.status) updateData.status = body.status
    if (body.adminNotes !== undefined) updateData.adminNotes = body.adminNotes

    const updatedClaim = await prisma.claim.update({
      where: { id },
      data: updateData,
    })

    if (body.status === 'VERIFIED' && claim.itemId) {
      const item = await prisma.item.update({
        where: { id: claim.itemId },
        data: { status: 'CLAIMED' },
      })

      // Send email to reporter that their item was claimed
      if (item.reporterEmail) {
        const emailContent = generateClaimVerifiedEmail(item.title, claim.name)
        await sendEmail({
          to: item.reporterEmail,
          toName: item.reporterName || undefined,
          subject: emailContent.subject,
          htmlContent: emailContent.htmlContent,
        })
      }
    }

    return NextResponse.json(updatedClaim)
  } catch (error) {
    console.error('Error updating claim:', error)
    return NextResponse.json(
      { error: 'Failed to update claim' },
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

    await prisma.claim.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting claim:', error)
    return NextResponse.json(
      { error: 'Failed to delete claim' },
      { status: 500 }
    )
  }
}
