import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

export async function readJson<T>(filename: string, defaultData: T): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch (error) {
    // If file doesn't exist, create it with defaultData
    await writeJson(filename, defaultData);
    return defaultData;
  }
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`[db-helper] Failed to write JSON to ${filename}:`, error);
    throw error;
  }
}
