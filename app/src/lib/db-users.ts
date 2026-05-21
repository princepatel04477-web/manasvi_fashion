import { supabase } from "./supabase";
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
  "admin@manasvifashion.com",
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
  const passwordHash = await bcrypt.hash("Password123", salt);
  
  return [
    {
      id: "usr-admin",
      name: "Manasvi Admin",
      email: "admin@manasvifashion.com",
      passwordHash: passwordHash,
      role: "admin",
      createdAt: new Date().toISOString()
    }
  ];
}

export async function getUsers(): Promise<User[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*");

      if (!error && data) {
        interface DbUserRow {
          id: string | number;
          name: string;
          email: string;
          password_hash: string;
          role: "admin" | "customer";
          phone?: string;
          shipping_address?: string;
          city?: string;
          postal_code?: string;
          created_at: string;
          createdAt?: string;
        }
        return (data as unknown as DbUserRow[]).map((item) => ({
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
      }
      console.warn("[db-users] Supabase select users failed:", error?.message);
    } catch (err) {
      console.warn("[db-users] Supabase users error:", err);
    }
  }

  const seed = await getSeedUsers();
  return readJson<User[]>(USERS_FILE, seed);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const all = await getUsers();
  return all.find((u) => u.email.toLowerCase() === email.toLowerCase());
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

  if (supabase) {
    try {
      const { error } = await supabase
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

  const all = await getUsers();
  all.push(newUser);
  await writeJson<User[]>(USERS_FILE, all);
  return newUser;
}
