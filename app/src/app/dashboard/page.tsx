export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-4xl">User Dashboard</h1>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[
          "Order History",
          "Saved Addresses",
          "Wishlist",
          "Returns",
          "Profile Management",
          "Order Tracking",
        ].map((item) => <div key={item} className="editorial-card rounded-xl p-6 font-medium">{item}</div>)}
      </div>
    </main>
  );
}
