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
  "varunyatechnologies@gmail.com"
];

// Helper to check if email is admin or seller
export function getRoleByEmail(email: string): User["role"] {
  const normalized = email.toLowerCase();
  if (normalized === "manasvifashion1515@gmail.com") {
    return "seller";
  }
  if (ADMIN_EMAILS.includes(normalized)) {
    return "admin"; // Admin role
  }
  return "customer"; // Default customer role
}

async function getSeedUsers(): Promise<User[]> {
  const [hash1, hash2, hash3] = await Promise.all([
    bcrypt.hash("Prince_1258", 10),
    bcrypt.hash("PAM_262127", 10),
    bcrypt.hash("manu@1515", 10),
  ]);

  return [
    {
      id: "usr-admin-1",
      name: "Prince Patel",
      email: "princepatel01258@gmail.com",
      passwordHash: hash1,
      role: "admin",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr-admin-2",
      name: "Varunya Technologies",
      email: "varunyatechnologies@gmail.com",
      passwordHash: hash2,
      role: "admin",
      createdAt: new Date().toISOString()
    },
    {
      id: "usr-seller-1",
      name: "Manasvi Fashion",
      email: "manasvifashion1515@gmail.com",
      passwordHash: hash3,
      role: "seller",
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

  // Merge remote, local, and seed users by email (case-insensitive) to ensure latest seed
  // credentials always take absolute precedence.
  const mergedMap = new Map<string, User>();
  for (const u of dbUsers) {
    mergedMap.set(u.email.toLowerCase(), u);
  }
  for (const u of localUsers) {
    mergedMap.set(u.email.toLowerCase(), u);
  }
  for (const u of seed) {
    mergedMap.set(u.email.toLowerCase(), u);
  }
  return Array.from(mergedMap.values());
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const normalizedEmail = email.toLowerCase();
  
  // High-priority seed override to ensure developers and sellers can always log in
  const seed = await getSeedUsers();
  const seededUser = seed.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (seededUser) {
    return seededUser;
  }
  
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

export async function getUserByPhone(phone: string): Promise<User | undefined> {
  const cleanPhone = phone.trim();
  
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("phone", cleanPhone);

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
      console.warn("[db-users] Supabase getUserByPhone error:", err);
    }
  }

  const all = await getUsers();
  return all.find((u) => u.phone && u.phone.trim() === cleanPhone);
}

export async function registerPasswordlessUser(
  emailOrPhone: string,
  isEmail: boolean,
  name?: string
): Promise<User> {
  const nameToUse = name || (isEmail ? emailOrPhone.split("@")[0] : `Guest ${emailOrPhone}`);
  const emailToUse = isEmail ? emailOrPhone : `${emailOrPhone.replace(/[^0-9]/g, "")}@phone.manasvifashion.local`;
  const phoneToUse = isEmail ? undefined : emailOrPhone;
  
  // Register with a random secure password hash
  const randomPassword = Math.random().toString(36).slice(-10);
  return registerUser(
    nameToUse,
    emailToUse,
    randomPassword,
    phoneToUse
  );
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
