import HomePage from '@/components/home/HomePage'
import { getFeaturedProducts } from '@/lib/products'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const featuredProducts = await getFeaturedProducts()

  return <HomePage featuredProducts={featuredProducts} />
}
