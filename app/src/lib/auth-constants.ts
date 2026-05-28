export const nextAuthSecret = (() => {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is required for authentication.");
  }
  return secret;
})();

export function ensureNextAuthUrl(): void {
  const vercelUrl = process.env.VERCEL_URL;
  const currentUrl = process.env.NEXTAUTH_URL;

  if (vercelUrl && (!currentUrl || currentUrl.includes("localhost"))) {
    process.env.NEXTAUTH_URL = `https://${vercelUrl}`;
  }
}
