const fs = require('fs');
const path = require('path');

// Fichier spécifique à corriger
const filePath = path.join(process.cwd(), 'app/api/paliers/[id]/route.ts');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remplacer let updateData par const updateData
  content = content.replace(/let updateData\s*=\s*{}/g, 'const updateData: any = {}');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅ Fixed prefer-const in: ${filePath}`);
} catch (error) {
  console.error(`❌ Error: ${error.message}`);
}