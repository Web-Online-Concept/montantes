const fs = require('fs');
const path = require('path');

// Fichiers à corriger avec leurs lignes problématiques
const filesToFix = {
  'components/CarteMontante.tsx': [97],
  'app/admin/montantes/[id]/editer/page.tsx': [489],
  'app/montante/[id]/page.tsx': [243],
  'app/statistiques/page.tsx': [258]
};

function fixFile(filePath, lineNumbers) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Remplacer &apos; par ' dans les expressions JavaScript (entre accolades)
    content = content.replace(/\{([^}]*&apos;[^}]*)\}/g, (match) => {
      return match.replace(/&apos;/g, "'");
    });
    
    // Remplacer &quot; par " dans les expressions JavaScript
    content = content.replace(/\{([^}]*&quot;[^}]*)\}/g, (match) => {
      return match.replace(/&quot;/g, '"');
    });
    
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Correction des apostrophes dans les expressions ternaires...\n');

let fixed = 0;
Object.entries(filesToFix).forEach(([file, lines]) => {
  if (fixFile(file, lines)) {
    fixed++;
  }
});

console.log(`\n✨ Terminé ! ${fixed} fichiers corrigés.`);
console.log('\n💡 Prochaines étapes :');
console.log('1. git add .');
console.log('2. git commit -m "Fix: Correction apostrophes dans expressions JavaScript"');
console.log('3. git push');