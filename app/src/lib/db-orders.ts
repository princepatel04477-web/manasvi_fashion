import { supabaseAdmin } from "./supabase";
import { readJson, writeJson } from "./db-helper";

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
  size: string;
  image?: string;
  slug?: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "returned" | "cancelled";
  paymentStatus: "paid" | "unpaid" | "failed" | "refunded";
  shippingAddress: string;
  createdAt: string;
}

const ORDERS_FILE = "orders-db.json";

// Default mock orders to populate dashboard instantly
const defaultOrders: Order[] = [
  {
    id: "ORD-928103",
    customerName: "Aishwarya Rai",
    customerEmail: "aishwarya@example.com",
    customerPhone: "+919988776655",
    items: [
      {
        productId: "p1",
        title: "Elara Signature Kurti",
        price: 3499,
        qty: 1,
        size: "M",
        image: "/photos/052081f1262d42453b2864b2120581c84be1200dd8a51d24744a6d9c4abb5992.png",
        slug: "elara-signature-kurti"
      }
    ],
    totalAmount: 3499,
    status: "delivered",
    paymentStatus: "paid",
    shippingAddress: "Bungalow 4, Juhu Scheme, Vile Parle West, Mumbai, MH - 400049",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: "ORD-928104",
    customerName: "Priyanka Chopra",
    customerEmail: "priyanka@example.com",
    customerPhone: "+919876543210",
    items: [
      {
        productId: "p3",
        title: "Myra Classic Dress",
        price: 4899,
        qty: 1,
        size: "S",
        image: "/photos/7991032735d4941dd872e07f4fbe08e9b26d6ab69dd81479a7c1782d6be2067c.png",
        slug: "myra-classic-dress"
      },
      {
        productId: "p2",
        title: "Ziva Regal Kurti",
        price: 3699,
        qty: 1,
        size: "S",
        image: "/photos/298a7d7ca464b6cebeb9831bbc04b2b30be7f8d60df05f982bda5a28edd8cf9c.png",
        slug: "ziva-regal-kurti"
      }
    ],
    totalAmount: 8598,
    status: "processing",
    paymentStatus: "paid",
    shippingAddress: "Flat 12B, Marine Drive Mansions, Marine Drive, Mumbai, MH - 400020",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: "ORD-928105",
    customerName: "Deepika Padukone",
    customerEmail: "deepika@example.com",
    customerPhone: "+919865324710",
    items: [
      {
        productId: "p5",
        title: "Noor Occasion Kurti",
        price: 3399,
        qty: 2,
        size: "L",
        image: "/photos/9bb581778c2cc6cef86ace04050044b5de5c1f79cc848f23ac0750c0ad40d7fa.png",
        slug: "noor-occasion-kurti"
      }
    ],
    totalAmount: 6798,
    status: "pending",
    paymentStatus: "unpaid",
    shippingAddress: "Apartment 902, BeauMonde Towers, Prabhadevi, Mumbai, MH - 400025",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
  }
];

export async function getOrders(): Promise<Order[]> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        interface DbOrderRow {
          id: string | number;
          customer_name: string;
          customer_email: string;
          customer_phone?: string;
          items: string | OrderItem[];
          total_amount: number;
          status: Order["status"];
          payment_status: Order["paymentStatus"];
          shipping_address: string;
          created_at: string;
          createdAt?: string;
        }
        return (data as unknown as DbOrderRow[]).map((item) => ({
          id: String(item.id),
          customerName: item.customer_name,
          customerEmail: item.customer_email,
          customerPhone: item.customer_phone || undefined,
          items: Array.isArray(item.items) ? item.items : JSON.parse((item.items as string) || "[]"),
          totalAmount: Number(item.total_amount),
          status: item.status,
          paymentStatus: item.payment_status,
          shippingAddress: item.shipping_address,
          createdAt: item.created_at || item.createdAt
        })) as Order[];
      }
      console.warn("[db-orders] Supabase select failed:", error?.message);
    } catch (err) {
      console.warn("[db-orders] Supabase get error:", err);
    }
  }

  return readJson<Order[]>(ORDERS_FILE, defaultOrders);
}

export async function createOrder(input: Omit<Order, "id" | "createdAt">): Promise<Order> {
  const newOrder: Order = {
    ...input,
    id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString()
  };

  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("orders")
        .insert([
          {
            id: newOrder.id,
            customer_name: newOrder.customerName,
            customer_email: newOrder.customerEmail,
            customer_phone: newOrder.customerPhone || null,
            items: JSON.stringify(newOrder.items),
            total_amount: newOrder.totalAmount,
            status: newOrder.status,
            payment_status: newOrder.paymentStatus,
            shipping_address: newOrder.shippingAddress
          }
        ])
        .select();

      if (!error && data && data.length > 0) {
        console.log("[db-orders] Order created in Supabase:", data[0].id);
        return newOrder;
      }
      console.warn("[db-orders] Supabase order insert failed:", error?.message);
    } catch (err) {
      console.warn("[db-orders] Supabase create error:", err);
    }
  }

  const all = await readJson<Order[]>(ORDERS_FILE, defaultOrders);
  all.unshift(newOrder);
  await writeJson<Order[]>(ORDERS_FILE, all);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"],
  paymentStatus?: Order["paymentStatus"]
): Promise<Order | undefined> {
  if (supabaseAdmin) {
    try {
      const dbUpdates: { status: string; payment_status?: string } = { status };
      if (paymentStatus) dbUpdates.payment_status = paymentStatus;

      const { data, error } = await supabaseAdmin
        .from("orders")
        .update(dbUpdates)
        .eq("id", id)
        .select();

      if (!error && data && data.length > 0) {
        console.log("[db-orders] Order status updated in Supabase:", id);
      } else {
        console.warn("[db-orders] Supabase status update failed:", error?.message);
      }
    } catch (err) {
      console.warn("[db-orders] Supabase update status error:", err);
    }
  }

  const all = await readJson<Order[]>(ORDERS_FILE, defaultOrders);
  const index = all.findIndex((o) => o.id === id);
  if (index === -1) return undefined;

  all[index].status = status;
  if (paymentStatus) all[index].paymentStatus = paymentStatus;

  await writeJson<Order[]>(ORDERS_FILE, all);
  return all[index];
}
