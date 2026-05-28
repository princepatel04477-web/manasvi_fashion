import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

// In-memory fallback cache for serverless environments where disk writes fail or don't persist
const globalForDb = global as unknown as {
  dbCache?: Record<string, any>;
};

if (!globalForDb.dbCache) {
  globalForDb.dbCache = {};
}

const dbCache = globalForDb.dbCache;

export async function readJson<T>(filename: string, defaultData: T): Promise<T> {
  // Return cached data if present (updated during runtime/instantiation)
  if (dbCache[filename] !== undefined) {
    return dbCache[filename] as T;
  }

  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(content) as T;
    dbCache[filename] = data; // Cache it
    return data;
  } catch (error) {
    console.warn(`[db-helper] Failed to read ${filename} from disk. Using default/cached data.`);
    
    // Attempt to write the default data so it is present on disk for future local runs,
    // but handle failures gracefully (e.g., read-only filesystem on Vercel).
    try {
      await writeJson(filename, defaultData);
    } catch (writeError) {
      // Ignore write errors here since we have the data cached in memory
    }
    
    dbCache[filename] = defaultData;
    return defaultData;
  }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  // Always update in-memory cache first
  dbCache[filename] = data;

  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    const err = error as any;
    // Check if error is EROFS (Read-only file system), EACCES (Permission denied), or EPERM
    if (err.code === "EROFS" || err.code === "EACCES" || err.code === "EPERM" || err.code === "ENOENT") {
      console.warn(`[db-helper] Running in read-only/serverless environment. Data written to memory cache only for ${filename}.`);
      return;
    }
    // Re-throw other unexpected errors
    console.error(`[db-helper] Failed to write JSON to ${filename}:`, error);
    throw error;
  }
}
