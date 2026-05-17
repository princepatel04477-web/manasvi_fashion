import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import AccountClient from "./AccountClient"

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  // Fetch user data including orders
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email as string },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!user) {
    redirect('/login')
  }

  return <AccountClient user={user} />
}
