export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16"><h1 className="font-serif text-5xl">Contact</h1><form className="mt-8 space-y-4"><input placeholder="Name" className="w-full rounded-md border p-3" /><input placeholder="Email" className="w-full rounded-md border p-3" /><textarea rows={5} placeholder="Message" className="w-full rounded-md border p-3" /><button className="luxury-btn rounded-lg px-6 py-3">Send</button></form></main>
  );
}
