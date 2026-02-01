import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import prisma from '@/lib/db'
import { itemFormSchema, validateFile } from '@/lib/validators'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '@/lib/constants'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const q = searchParams.get('q')
    const category = searchParams.get('category')
    const location = searchParams.get('location')
    const status = searchParams.get('status')
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (status) {
      where.status = status
    } else {
      where.status = { in: ['APPROVED', 'CLAIMED'] }
    }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    }

    if (category) {
      where.category = category
    }

    if (location) {
      where.foundLocation = location
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' }
    if (sort === 'oldest') {
      orderBy = { createdAt: 'asc' }
    } else if (sort === 'views') {
      orderBy = { views: 'desc' }
    }

    const [items, total] = await Promise.all([
      prisma.item.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          category: true,
          description: true,
          foundLocation: true,
          foundAt: true,
          imageUrl: true,
          status: true,
          views: true,
          createdAt: true,
        },
      }),
      prisma.item.count({ where }),
    ])

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const imageFile = formData.get('image') as File
    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }

    if (!ALLOWED_FILE_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, WebP' },
        { status: 400 }
      )
    }

    if (imageFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    const data = {
      title: formData.get('title') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      foundLocation: formData.get('foundLocation') as string,
      foundAt: formData.get('foundAt') as string,
      reporterName: formData.get('reporterName') as string,
      reporterEmail: formData.get('reporterEmail') as string,
      reporterPhone: formData.get('reporterPhone') as string,
    }

    const validation = itemFormSchema.safeParse(data)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message || 'Validation failed' },
        { status: 400 }
      )
    }

    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const ext = imageFile.name.split('.').pop() || 'jpg'
    const filename = `${uuidv4()}.${ext}`
    
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    
    const filepath = join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    const item = await prisma.item.create({
      data: {
        title: validation.data.title,
        category: validation.data.category as 'ELECTRONICS' | 'CLOTHING' | 'JEWELRY' | 'BOOKS' | 'ID_WALLET' | 'KEYS' | 'OTHER',
        description: validation.data.description,
        foundLocation: validation.data.foundLocation as 'CAFETERIA' | 'GYM' | 'LIBRARY' | 'HALLWAY' | 'PARKING_LOT' | 'CLASSROOM' | 'OFFICE' | 'OTHER',
        foundAt: new Date(validation.data.foundAt),
        imageUrl: `/uploads/${filename}`,
        reporterName: validation.data.reporterName || null,
        reporterEmail: validation.data.reporterEmail,
        reporterPhone: validation.data.reporterPhone || null,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ id: item.id, success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating item:', error)
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    )
  }
}
