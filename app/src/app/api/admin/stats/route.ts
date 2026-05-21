import { NextResponse } from "next/server";
import { getOrders } from "@/lib/db-orders";
import { getProducts } from "@/lib/db-products";
import { getCoupons } from "@/lib/db-coupons";
import { getReviews } from "@/lib/db-reviews";

export async function GET() {
  try {
    const [orders, products, coupons, reviews] = await Promise.all([
      getOrders(),
      getProducts(),
      getCoupons(),
      getReviews()
    ]);

    // Total orders count
    const totalOrders = orders.length;

    // Total revenue from paid/delivered/processing/shipped orders
    const completedOrProcessing = orders.filter(
      o => o.paymentStatus === "paid" || ["delivered", "processing", "shipped"].includes(o.status)
    );
    const totalRevenue = completedOrProcessing.reduce((sum, o) => sum + o.totalAmount, 0);

    // Average Order Value (AOV)
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Total active products count
    const totalProducts = products.length;

    // Active coupons
    const activeCoupons = coupons.filter(c => c.active).length;

    // Pending review count
    const pendingReviewsCount = reviews.filter(r => !r.approved).length;

    // Low stock items (stock < 5)
    const lowStockItems = products.filter(p => p.stock < 5).map(p => ({
      id: p.id,
      title: p.title,
      stock: p.stock,
      slug: p.slug,
      image: p.images[0] || ""
    }));

    // Recent orders (last 5 orders)
    const recentOrders = orders.slice(0, 5).map(o => ({
      id: o.id,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      totalAmount: o.totalAmount,
      status: o.status,
      paymentStatus: o.paymentStatus,
      createdAt: o.createdAt
    }));

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        totalProducts,
        activeCoupons,
        pendingReviewsCount,
        lowStockItems,
        recentOrders
      }
    });
  } catch (error) {
    console.error("[api-admin-stats] GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to generate dashboard analytics." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
