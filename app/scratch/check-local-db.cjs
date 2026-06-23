const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/products-db.json');
if (!fs.existsSync(filePath)) {
  console.log("No local database file found.");
  process.exit(0);
}

try {
  const fileData = fs.readFileSync(filePath, 'utf8');
  const products = JSON.parse(fileData);
  console.log(`Local file has ${products.length} products:`);
  products.forEach(p => {
    if (p.category === 'one-piece' || p.productType === 'one_piece') {
      console.log(`FOUND: ID: ${p.id} | Title: ${p.title} | Category: ${p.category} | Product Type: ${p.productType}`);
    }
  });
} catch (e) {
  console.error(e);
}
