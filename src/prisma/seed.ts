import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean up existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.coupon.deleteMany()

  // 1. Create Admin User
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@mansvifashion.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('Admin user created:', admin.email)

  // 2. Create Categories
  const categories = [
    { name: 'Kurtis', slug: 'kurtis' },
    { name: 'Anarkali', slug: 'anarkali' },
    { name: 'Palazzo Sets', slug: 'palazzo-sets' },
    { name: 'Festive Wear', slug: 'festive-wear' },
    { name: 'Casual', slug: 'casual' },
  ]

  const createdCategories = await Promise.all(
    categories.map((c) =>
      prisma.category.create({
        data: c,
      })
    )
  )
  console.log(`Created ${createdCategories.length} categories`)

  // 3. Create Products
  const products = [
    {
      name: 'Gulabi Silk Anarkali Suit',
      slug: 'gulabi-silk-anarkali',
      description: 'Elegant blush pink silk Anarkali suit with intricate zari embroidery. Perfect for festive occasions and weddings.',
      price: 4999,
      comparePrice: 6999,
      images: JSON.stringify(['https://images.unsplash.com/photo-1583391733958-d651010375e8?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1610444985223-a212eab31828?q=80&w=600&auto=format&fit=crop']),
      categoryId: createdCategories.find(c => c.name === 'Anarkali')!.id,
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['#FCDDD8', '#E8C5BC']),
      fabric: 'Pure Silk',
      stock: 45,
      tags: JSON.stringify(['Festive', 'Wedding', 'Pink']),
    },
    {
      name: 'Midnight Cocoa Cotton Kurta',
      slug: 'midnight-cocoa-cotton-kurta',
      description: 'Comfortable straight cut cotton kurta in deep dark cocoa with minimal hand block print detailing.',
      price: 1499,
      images: JSON.stringify(['https://images.unsplash.com/photo-1620804473760-4966779b5c77?q=80&w=600&auto=format&fit=crop']),
      categoryId: createdCategories.find(c => c.name === 'Kurtis')!.id,
      sizes: JSON.stringify(['M', 'L', 'XL']),
      colors: JSON.stringify(['#3D2B26']),
      fabric: '100% Cotton',
      stock: 120,
      tags: JSON.stringify(['Casual', 'Daily Wear']),
    },
    {
      name: 'Peachy Floral Palazzo Set',
      slug: 'peachy-floral-palazzo-set',
      description: 'Light and airy georgette palazzo set in warm peachy nude with delicate floral motifs.',
      price: 2899,
      comparePrice: 3499,
      images: JSON.stringify(['https://images.unsplash.com/photo-1622515099516-72c219669527?q=80&w=600&auto=format&fit=crop']),
      categoryId: createdCategories.find(c => c.name === 'Palazzo Sets')!.id,
      sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
      colors: JSON.stringify(['#E8C5BC']),
      fabric: 'Georgette',
      stock: 60,
      tags: JSON.stringify(['Summer', 'Floral']),
    },
    {
      name: 'Salmon Pink Festive Lehenga',
      slug: 'salmon-pink-festive-lehenga',
      description: 'Stunning salmon pink lehenga set featuring heavy mirror work and a matching dupatta.',
      price: 8999,
      comparePrice: 12000,
      images: JSON.stringify(['https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop']),
      categoryId: createdCategories.find(c => c.name === 'Festive Wear')!.id,
      sizes: JSON.stringify(['S', 'M', 'L']),
      colors: JSON.stringify(['#F2AFA3']),
      fabric: 'Raw Silk',
      stock: 15,
      tags: JSON.stringify(['Wedding', 'Bridal', 'Party']),
    },
    {
      name: 'Warm Tan Chikankari Kurti',
      slug: 'warm-tan-chikankari-kurti',
      description: 'Classic straight chikankari embroidered kurti in a beautiful warm tan shade. An absolute wardrobe staple.',
      price: 2199,
      images: JSON.stringify(['https://images.unsplash.com/photo-1625805562723-954f9810852e?q=80&w=600&auto=format&fit=crop']),
      categoryId: createdCategories.find(c => c.name === 'Kurtis')!.id,
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL', '3XL']),
      colors: JSON.stringify(['#C0A090']),
      fabric: 'Cotton Blend',
      stock: 85,
      tags: JSON.stringify(['Classic', 'Chikankari']),
    },
    {
      name: 'Blush Nude Chanderi Suit',
      slug: 'blush-nude-chanderi-suit',
      description: 'A graceful Chanderi silk suit set in blush nude, featuring subtle zari weaving and a scalloped dupatta.',
      price: 4299,
      images: JSON.stringify(['https://images.unsplash.com/photo-1617260558117-919bd5f3e2fc?q=80&w=600&auto=format&fit=crop']),
      categoryId: createdCategories.find(c => c.name === 'Festive Wear')!.id,
      sizes: JSON.stringify(['M', 'L', 'XL']),
      colors: JSON.stringify(['#FCDDD8']),
      fabric: 'Chanderi Silk',
      stock: 30,
      tags: JSON.stringify(['Elegant', 'Festive']),
    },
    {
      name: 'Everyday Printed Cotton Kurti',
      slug: 'everyday-printed-cotton-kurti',
      description: 'A breathable cotton kurti with geometric prints, perfect for office or casual daily wear.',
      price: 999,
      comparePrice: 1299,
      images: JSON.stringify(['https://images.unsplash.com/photo-1626290805177-3be46b0a9448?q=80&w=600&auto=format&fit=crop']),
      categoryId: createdCategories.find(c => c.name === 'Casual')!.id,
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['#F2AFA3', '#3D2B26']),
      fabric: 'Cotton',
      stock: 150,
      tags: JSON.stringify(['Daily Wear', 'Printed']),
    },
    {
      name: 'Cocoa Brown Velvet Kurta Set',
      slug: 'cocoa-brown-velvet-kurta-set',
      description: 'Luxurious dark cocoa velvet kurta paired with straight pants. Embellished with gold threadwork on the neckline.',
      price: 5499,
      images: JSON.stringify(['https://images.unsplash.com/photo-1615560933560-61c02ab9b86d?q=80&w=600&auto=format&fit=crop']),
      categoryId: createdCategories.find(c => c.name === 'Festive Wear')!.id,
      sizes: JSON.stringify(['M', 'L']),
      colors: JSON.stringify(['#3D2B26']),
      fabric: 'Velvet',
      stock: 20,
      tags: JSON.stringify(['Winter', 'Luxurious']),
    },
    {
      name: 'Salmon & Blush Ombre Kurti',
      slug: 'salmon-blush-ombre-kurti',
      description: 'A beautiful A-line kurti featuring an ombre transition from blush nude to salmon pink.',
      price: 1899,
      images: JSON.stringify(['https://images.unsplash.com/photo-1631541909061-71e34aabdb62?q=80&w=600&auto=format&fit=crop']),
      categoryId: createdCategories.find(c => c.name === 'Kurtis')!.id,
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['#F2AFA3', '#FCDDD8']),
      fabric: 'Rayon',
      stock: 75,
      tags: JSON.stringify(['Ombre', 'A-line']),
    },
    {
      name: 'Tan Linen Blend Palazzo Suit',
      slug: 'tan-linen-blend-palazzo-suit',
      description: 'A minimalist linen blend palazzo suit in a warm tan shade, featuring a sleeveless tunic and wide-leg bottoms.',
      price: 3199,
      images: JSON.stringify(['https://images.unsplash.com/photo-1631541909061-71e34aabdb62?q=80&w=600&auto=format&fit=crop']), // Using same placeholder as above for variety
      categoryId: createdCategories.find(c => c.name === 'Palazzo Sets')!.id,
      sizes: JSON.stringify(['XS', 'S', 'M', 'L']),
      colors: JSON.stringify(['#C0A090']),
      fabric: 'Linen Blend',
      stock: 40,
      tags: JSON.stringify(['Minimalist', 'Summer']),
    }
  ]

  const createdProducts = await Promise.all(
    products.map(p => prisma.product.create({ data: p }))
  )
  console.log(`Created ${createdProducts.length} products`)

  // 4. Create a Sample Coupon
  await prisma.coupon.create({
    data: {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE',
      value: 10,
      usageLimit: 100,
    }
  })
  console.log('Created sample coupon: WELCOME10')

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
