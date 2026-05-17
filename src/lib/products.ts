import prisma from '@/lib/prisma'

export async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    })
  } catch (error) {
    console.error("Error fetching featured products:", error)
    return []
  }
}
