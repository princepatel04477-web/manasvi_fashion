import ShopPage from '@/components/shop/ShopPage'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  })

  const categories = await prisma.category.findMany()

  return <ShopPage initialProducts={products} categories={categories} />
}
