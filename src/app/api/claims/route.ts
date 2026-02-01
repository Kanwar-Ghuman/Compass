import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { claimFormSchema } from '@/lib/validators'
import { sendEmail, generateItemClaimedEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const status = searchParams.get('status')
    const itemId = searchParams.get('itemId')
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    }

    if (itemId) {
      where.itemId = itemId
    }

    const [claims, total] = await Promise.all([
      prisma.claim.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          item: {
            select: {
              id: true,
              title: true,
              imageUrl: true,
              status: true,
            },
          },
        },
      }),
      prisma.claim.count({ where }),
    ])

    return NextResponse.json({
      claims,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching claims:', error)
    return NextResponse.json(
      { error: 'Failed to fetch claims' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const validation = claimFormSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      )
    }

    if (validation.data.claimType === 'CLAIM' && validation.data.itemId) {
      const item = await prisma.item.findUnique({
        where: { id: validation.data.itemId },
      })

      if (!item) {
        return NextResponse.json(
          { error: 'Item not found' },
          { status: 404 }
        )
      }

      if (item.status !== 'APPROVED') {
        return NextResponse.json(
          { error: 'This item is not available for claiming' },
          { status: 400 }
        )
      }
    }

    const claim = await prisma.claim.create({
      data: {
        claimType: validation.data.claimType,
        itemId: validation.data.itemId || null,
        name: validation.data.name,
        email: validation.data.email,
        proofDetails: validation.data.proofDetails || null,
        message: validation.data.message || null,
        status: 'SUBMITTED',
      },
    })

    // Send email notification to the item reporter if this is a claim
    if (validation.data.claimType === 'CLAIM' && validation.data.itemId) {
      const item = await prisma.item.findUnique({
        where: { id: validation.data.itemId },
      })

      if (item && item.reporterEmail) {
        const emailContent = generateItemClaimedEmail(item.title, validation.data.name)
        await sendEmail({
          to: item.reporterEmail,
          toName: item.reporterName || undefined,
          subject: emailContent.subject,
          htmlContent: emailContent.htmlContent,
        })
      }
    }

    return NextResponse.json({ id: claim.id, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating claim:', error)
    return NextResponse.json(
      { error: 'Failed to submit claim' },
      { status: 500 }
    )
  }
}
