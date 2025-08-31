const fs = require('fs');
const path = require('path');
const { specs } = require('../src/config/swagger');

// Generate Swagger JSON file
const swaggerJson = JSON.stringify(specs, null, 2);

// Write to file
const outputPath = path.join(__dirname, '..', 'swagger.json');
fs.writeFileSync(outputPath, swaggerJson);

console.log(`✅ Swagger JSON generated at: ${outputPath}`);
console.log(`📄 File size: ${(swaggerJson.length / 1024).toFixed(2)} KB`);
