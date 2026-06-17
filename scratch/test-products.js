import { getProducts } from "../app/src/lib/db-products.js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.pulled" });

async function run() {
  try {
    const products = await getProducts();
    console.log("Total products fetched:", products.length);
    products.forEach(p => {
      console.log(`- ID: ${p.id}, Title: ${p.title}, Category: ${p.category}, Type: ${p.productType}`);
    });
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
