import { supabaseAdmin } from "./supabase";
import { readJson, writeJson } from "./db-helper";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "seller" | "customer";
  phone?: string;
  shippingAddress?: string;
  city?: string;
  postalCode?: string;
  createdAt: string;
}

const USERS_FILE = "users-db.json";

export const ADMIN_EMAILS = [
  "princepatel01258@gmail.com",
  "prince@example.com",
  "aryan@example.com"
];

// Helper to check if email is admin
export function getRoleByEmail(email: string): User["role"] {
  const normalized = email.toLowerCase();
  if (ADMIN_EMAILS.includes(normalized)) {
    return "admin"; // Admin role
  }
  return "customer"; // Default customer role
}

async function getSeedUsers(): Promise<User[]> {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Prince_1258", salt);
  
  return [
    {
      id: "usr-admin",
      name: "Prince Patel",
      email: "princepatel01258@gmail.com",
      passwordHash: passwordHash,
      role: "admin",
      createdAt: new Date().toISOString()
    }
  ];
}

export async function getUsers(): Promise<User[]> {
  let dbUsers: User[] = [];
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*");

      if (!error && data) {
        interface DbUserRow {
          id: string | number;
          name: string;
          email: string;
          password_hash: string;
          role: "admin" | "seller" | "customer";
          phone?: string;
          shipping_address?: string;
          city?: string;
          postal_code?: string;
          created_at: string;
          createdAt?: string;
        }
        dbUsers = (data as unknown as DbUserRow[]).map((item) => ({
          id: String(item.id),
          name: item.name,
          email: item.email,
          passwordHash: item.password_hash,
          role: item.role,
          phone: item.phone,
          shippingAddress: item.shipping_address,
          city: item.city,
          postalCode: item.postal_code,
          createdAt: item.created_at || item.createdAt
        })) as User[];
      } else {
        console.warn("[db-users] Supabase select users failed:", error?.message);
      }
    } catch (err) {
      console.warn("[db-users] Supabase users error:", err);
    }
  }

  const seed = await getSeedUsers();
  const localUsers = await readJson<User[]>(USERS_FILE, seed);

  // Merge seed, local and remote users by email (case-insensitive) to ensure local users (e.g. seeded admin)
  // are always accessible and not masked by an empty Supabase db.
  const mergedMap = new Map<string, User>();
  for (const u of seed) {
    mergedMap.set(u.email.toLowerCase(), u);
  }
  for (const u of localUsers) {
    mergedMap.set(u.email.toLowerCase(), u);
  }
  for (const u of dbUsers) {
    mergedMap.set(u.email.toLowerCase(), u);
  }
  return Array.from(mergedMap.values());
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const normalizedEmail = email.toLowerCase();
  
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", normalizedEmail);

      if (!error && data && data.length > 0) {
        const item = data[0];
        return {
          id: String(item.id),
          name: item.name,
          email: item.email,
          passwordHash: item.password_hash,
          role: item.role,
          phone: item.phone,
          shippingAddress: item.shipping_address,
          city: item.city,
          postalCode: item.postal_code,
          createdAt: item.created_at || item.createdAt
        };
      }
    } catch (err) {
      console.warn("[db-users] Supabase getUserByEmail error:", err);
    }
  }

  const all = await getUsers();
  return all.find((u) => u.email.toLowerCase() === normalizedEmail);
}

export async function registerUser(
  name: string,
  email: string,
  passwordPlain: string,
  phone?: string,
  shippingAddress?: string,
  city?: string,
  postalCode?: string
): Promise<User> {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(passwordPlain, salt);
  const role = getRoleByEmail(email);

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    passwordHash,
    role,
    phone,
    shippingAddress,
    city,
    postalCode,
    createdAt: new Date().toISOString()
  };

  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("users")
        .insert([
          {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            password_hash: newUser.passwordHash,
            role: newUser.role,
            phone: newUser.phone,
            shipping_address: newUser.shippingAddress,
            city: newUser.city,
            postal_code: newUser.postalCode
          }
        ]);

      if (!error) {
        console.log("[db-users] User registered in Supabase:", newUser.email);
        return newUser;
      }
      console.warn("[db-users] Supabase user registration failed:", error.message);
    } catch (err) {
      console.warn("[db-users] Supabase register user error:", err);
    }
  }

  // To prevent write duplication/masking, read and append directly to local JSON list
  const seed = await getSeedUsers();
  const allLocal = await readJson<User[]>(USERS_FILE, seed);
  
  if (!allLocal.some((u) => u.email.toLowerCase() === newUser.email.toLowerCase())) {
    allLocal.push(newUser);
    await writeJson<User[]>(USERS_FILE, allLocal);
  }
  return newUser;
}
