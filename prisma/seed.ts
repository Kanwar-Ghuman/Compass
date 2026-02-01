import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleItems = [
  {
    title: 'Blue iPhone 15 Pro',
    category: 'ELECTRONICS',
    description: 'Blue iPhone 15 Pro with a clear case. Found near the main entrance. Has a cracked screen protector.',
    foundLocation: 'HALLWAY',
    foundAt: new Date('2024-01-15T08:30:00'),
    imageUrl: '/placeholder.svg',
    status: 'APPROVED',
    reporterEmail: 'reporter1@school.edu',
    reporterName: 'John Smith',
    views: 45,
  },
  {
    title: 'Red Nike Hoodie - Size M',
    category: 'CLOTHING',
    description: 'Red Nike hoodie, size medium. Left on the bleachers during basketball practice.',
    foundLocation: 'GYM',
    foundAt: new Date('2024-01-14T15:45:00'),
    imageUrl: '/placeholder.svg',
    status: 'APPROVED',
    reporterEmail: 'reporter2@school.edu',
    views: 32,
  },
  {
    title: 'Silver Watch with Leather Band',
    category: 'JEWELRY',
    description: 'Beautiful silver analog watch with brown leather band. Found in the restroom near the cafeteria.',
    foundLocation: 'CAFETERIA',
    foundAt: new Date('2024-01-13T12:00:00'),
    imageUrl: '/placeholder.svg',
    status: 'APPROVED',
    reporterEmail: 'reporter3@school.edu',
    reporterName: 'Emma Wilson',
    views: 67,
  },
  {
    title: 'Calculus Textbook - 8th Edition',
    category: 'BOOKS',
    description: 'Calculus Early Transcendentals 8th Edition by James Stewart. Has some highlighting inside.',
    foundLocation: 'LIBRARY',
    foundAt: new Date('2024-01-12T16:30:00'),
    imageUrl: '/placeholder.svg',
    status: 'APPROVED',
    reporterEmail: 'reporter4@school.edu',
    views: 28,
  },
  {
    title: 'Student ID Card - Maria G.',
    category: 'ID_WALLET',
    description: 'Student ID card belonging to Maria G. Found on the ground near the parking lot.',
    foundLocation: 'PARKING_LOT',
    foundAt: new Date('2024-01-11T07:45:00'),
    imageUrl: '/placeholder.svg',
    status: 'CLAIMED',
    reporterEmail: 'reporter5@school.edu',
    views: 15,
  },
  {
    title: 'Car Keys with Toyota Fob',
    category: 'KEYS',
    description: 'Set of car keys with Toyota key fob and several other keys. Has a blue keychain.',
    foundLocation: 'CLASSROOM',
    foundAt: new Date('2024-01-10T14:20:00'),
    imageUrl: '/placeholder.svg',
    status: 'APPROVED',
    reporterEmail: 'reporter6@school.edu',
    reporterName: 'David Chen',
    views: 89,
  },
  {
    title: 'Black Laptop Charger',
    category: 'ELECTRONICS',
    description: 'Dell laptop charger, 65W. Left plugged in at the library computer station.',
    foundLocation: 'LIBRARY',
    foundAt: new Date('2024-01-09T11:00:00'),
    imageUrl: '/placeholder.svg',
    status: 'APPROVED',
    reporterEmail: 'reporter7@school.edu',
    views: 41,
  },
  {
    title: 'Gray North Face Backpack',
    category: 'OTHER',
    description: 'Gray North Face backpack with various school supplies inside. No ID found.',
    foundLocation: 'CAFETERIA',
    foundAt: new Date('2024-01-08T13:15:00'),
    imageUrl: '/placeholder.svg',
    status: 'PENDING',
    reporterEmail: 'reporter8@school.edu',
    views: 0,
  },
  {
    title: 'Gold Bracelet with Charms',
    category: 'JEWELRY',
    description: 'Gold charm bracelet with various charms including a heart and star. Found in the gym locker room.',
    foundLocation: 'GYM',
    foundAt: new Date('2024-01-07T17:30:00'),
    imageUrl: '/placeholder.svg',
    status: 'APPROVED',
    reporterEmail: 'reporter9@school.edu',
    reporterName: 'Sarah Johnson',
    views: 56,
  },
  {
    title: 'Wireless Earbuds Case',
    category: 'ELECTRONICS',
    description: 'White wireless earbuds case (no brand visible). Found in the main office waiting area.',
    foundLocation: 'OFFICE',
    foundAt: new Date('2024-01-06T09:00:00'),
    imageUrl: '/placeholder.svg',
    status: 'APPROVED',
    reporterEmail: 'reporter10@school.edu',
    views: 73,
  },
  {
    title: 'Purple Water Bottle',
    category: 'OTHER',
    description: 'Large purple Hydro Flask water bottle with stickers. Found near the soccer field.',
    foundLocation: 'GYM',
    foundAt: new Date('2024-01-05T16:00:00'),
    imageUrl: '/placeholder.svg',
    status: 'PENDING',
    reporterEmail: 'reporter11@school.edu',
    views: 0,
  },
  {
    title: 'Brown Leather Wallet',
    category: 'ID_WALLET',
    description: 'Brown leather bi-fold wallet with some cash inside. No ID cards found.',
    foundLocation: 'HALLWAY',
    foundAt: new Date('2024-01-04T10:30:00'),
    imageUrl: '/placeholder.svg',
    status: 'APPROVED',
    reporterEmail: 'reporter12@school.edu',
    reporterName: 'Michael Brown',
    views: 94,
  },
]

const sampleClaims = [
  {
    claimType: 'CLAIM',
    name: 'Alex Thompson',
    email: 'alex.t@school.edu',
    proofDetails: 'The phone has a specific wallpaper of my dog named Max. Also, my phone case has initials AT on the inside.',
    status: 'IN_REVIEW',
  },
  {
    claimType: 'INQUIRY',
    name: 'Jessica Lee',
    email: 'jessica.lee@school.edu',
    message: 'I lost my black umbrella somewhere in the school last week. Has anyone turned one in?',
    status: 'SUBMITTED',
  },
  {
    claimType: 'CLAIM',
    name: 'Ryan Martinez',
    email: 'ryan.m@school.edu',
    proofDetails: 'The watch was a gift from my grandmother. It has an engraving on the back that says "To Ryan, Love Grandma".',
    status: 'VERIFIED',
  },
]

async function main() {
  console.log('Starting seed...')

  await prisma.claim.deleteMany()
  await prisma.item.deleteMany()

  console.log('Creating items...')
  const createdItems = []
  for (const item of sampleItems) {
    const created = await prisma.item.create({
      data: {
        ...item,
        category: item.category as 'ELECTRONICS' | 'CLOTHING' | 'JEWELRY' | 'BOOKS' | 'ID_WALLET' | 'KEYS' | 'OTHER',
        foundLocation: item.foundLocation as 'CAFETERIA' | 'GYM' | 'LIBRARY' | 'HALLWAY' | 'PARKING_LOT' | 'CLASSROOM' | 'OFFICE' | 'OTHER',
        status: item.status as 'PENDING' | 'APPROVED' | 'CLAIMED' | 'ARCHIVED' | 'REJECTED',
      },
    })
    createdItems.push(created)
    console.log(`Created item: ${created.title}`)
  }

  console.log('Creating claims...')
  for (let i = 0; i < sampleClaims.length; i++) {
    const claim = sampleClaims[i]
    const created = await prisma.claim.create({
      data: {
        ...claim,
        status: claim.status as 'SUBMITTED' | 'IN_REVIEW' | 'VERIFIED' | 'DENIED' | 'RESOLVED',
        itemId: i < createdItems.length ? createdItems[i].id : null,
      },
    })
    console.log(`Created claim from: ${created.name}`)
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
