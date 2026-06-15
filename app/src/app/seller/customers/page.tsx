"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Loader2, 
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  IndianRupee
} from "lucide-react";

interface OrderItem {
  productId: string;
  qty: number;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
}

export default function SellerCustomers() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (res.ok) {
          const orders: Order[] = await res.json();
          
          // Aggregate customers by email
          const map = new Map<string, CustomerProfile>();

          orders.forEach(o => {
            const email = o.customerEmail.toLowerCase().trim();
            // Parse city from address if possible
            let city = "Bespoke Client";
            if (o.shippingAddress) {
              const parts = o.shippingAddress.split(",");
              if (parts.length > 1) {
                // Usually the city is before the pin or state
                const cityPart = parts[parts.length - 1].split("-")[0].trim();
                city = cityPart || parts[parts.length - 2].trim() || "India";
              }
            }

            if (map.has(email)) {
              const existing = map.get(email)!;
              existing.ordersCount += 1;
              existing.totalSpent += Number(o.totalAmount);
            } else {
              map.set(email, {
                name: o.customerName,
                email: o.customerEmail,
                phone: o.customerPhone || "Not Provided",
                city: city,
                ordersCount: 1,
                totalSpent: Number(o.totalAmount)
              });
            }
          });

          setCustomers(Array.from(map.values()));
        }
      } catch (err) {
        console.error("Failed to aggregate customers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF7F2]">Client Directory</h1>
        <p className="text-xs text-[#8B6B61] font-light mt-1">Review contact records, delivery regions, and order frequencies for boutique clients.</p>
      </div>

      {/* Search Bar */}
      <div className="flex bg-[#171110] border border-[#C98E87]/10 p-4 rounded-2xl">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8B6B61]/80" />
          <input 
            type="text"
            placeholder="Search Client Name, Email, City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#110C0B] border border-[#C98E87]/10 py-2.5 pl-10 pr-4 rounded-xl text-xs text-[#FAF7F2] placeholder-[#8B6B61]/40 focus:outline-none focus:border-[#C98E87] transition-all font-light"
          />
        </div>
      </div>

      {/* Directory Grid */}
      <div className="bg-[#171110] border border-[#C98E87]/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-[#C98E87] animate-spin" />
            <span className="text-xs text-[#8B6B61] tracking-wider uppercase">Aggregating profiles...</span>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <Users className="w-8 h-8 text-[#C98E87] mx-auto opacity-40" />
            <h3 className="font-serif text-lg italic text-[#FAF7F2]/60">No Clients Registered</h3>
            <p className="text-xs text-[#8B6B61]/60 font-light font-sans">Customer records will populate automatically upon payment success.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-[#C98E87]/10 text-[#8B6B61] text-[9px] uppercase tracking-widest bg-[#1E1715]/40">
                  <th className="p-4 font-medium">Initial</th>
                  <th className="p-4 font-medium">Client Name</th>
                  <th className="p-4 font-medium">Email Address</th>
                  <th className="p-4 font-medium">Contact</th>
                  <th className="p-4 font-medium">City / Region</th>
                  <th className="p-4 font-medium">Acquisitions</th>
                  <th className="p-4 font-medium text-right">Value Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C98E87]/5 text-[#FAF7F2]/80">
                {filteredCustomers.map((c, idx) => (
                  <tr key={idx} className="hover:bg-[#C98E87]/5 transition-colors">
                    {/* Initial Circle */}
                    <td className="p-4">
                      <div className="w-8 h-8 rounded-full bg-[#C98E87]/10 border border-[#C98E87]/20 flex items-center justify-center font-serif text-xs text-[#C98E87]">
                        {c.name.charAt(0)}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="p-4 font-medium text-sm text-[#FAF7F2]">
                      {c.name}
                    </td>

                    {/* Email */}
                    <td className="p-4 font-mono text-xs text-[#8B6B61] select-all">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#C98E87]/50" />
                        <span>{c.email}</span>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="p-4 font-mono text-xs text-[#8B6B61] select-all">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#C98E87]/50" />
                        <span>{c.phone}</span>
                      </div>
                    </td>

                    {/* City */}
                    <td className="p-4 font-light text-[#FAF7F2]/90">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C98E87]/50" />
                        <span className="capitalize">{c.city}</span>
                      </div>
                    </td>

                    {/* Total Orders */}
                    <td className="p-4 font-mono text-xs">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#C98E87]/50" />
                        <span>{c.ordersCount} {c.ordersCount === 1 ? "order" : "orders"}</span>
                      </div>
                    </td>

                    {/* Total Spent */}
                    <td className="p-4 text-right font-mono font-medium text-sm text-[#C98E87]">
                      ₹{c.totalSpent.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
