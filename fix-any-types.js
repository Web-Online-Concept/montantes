const fs = require('fs');
const path = require('path');

// Ajout de types spécifiques au lieu de 'any'
const typeReplacements = {
  'app/admin/bankroll/page.tsx': [
    { line: 22, from: 'any', to: 'HistoriqueBankroll' }
  ],
  'app/admin/historique/page.tsx': [
    { line: 26, from: 'any[]', to: 'HistoriqueBankroll[]' },
    { line: 52, from: 'any', to: '{ bankrollInitiale: number; bankrollActuelle: number; variationTotale: number; totalDepots: number; totalRetraits: number; totalGains: number; totalPertes: number }' }
  ],
  'app/historique/page.tsx': [
    { line: 9, from: 'any[]', to: 'HistoriqueBankroll[]' },
    { line: 10, from: 'any', to: '{ bankrollInitiale: number; bankrollActuelle: number; variationTotale: number; totalDepots: number; totalRetraits: number; totalGains: number; totalPertes: number }' }
  ],
  'app/statistiques/page.tsx': [
    { line: 12, from: 'any[]', to: 'Array<{ date: string; montant: number; type: string }>' },
    { line: 13, from: 'any[]', to: 'Montante[]' }
  ],
  'app/page.tsx': [
    { line: 11, from: 'any[]', to: 'Montante[]' }
  ]
};

function addTypeImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Vérifier si les imports nécessaires sont présents
  if (!content.includes("import { HistoriqueBankroll")) {
    // Ajouter l'import après les autres imports @/
    const lastImportMatch = content.match(/import.*from\s+['"]@\/.*['"]/g);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      const insertPos = content.indexOf(lastImport) + lastImport.length;
      content = content.slice(0, insertPos) + 
                "\nimport type { HistoriqueBankroll, Montante } from '@/types'" + 
                content.slice(insertPos);
    }
  }
  
  return content;
}

function fixAnyTypes(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Ajouter les imports si nécessaire
    const newContent = addTypeImports(filePath);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
    
    // Remplacer les types any
    replacements.forEach(({ from, to }) => {
      const regex = new RegExp(`:\\s*${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
      if (content.match(regex)) {
        content = content.replace(regex, `: ${to}`);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed types in: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Exécuter les corrections
console.log('🔧 Correction des types any...\n');

let totalFixed = 0;
Object.entries(typeReplacements).forEach(([file, replacements]) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath) && fixAnyTypes(filePath, replacements)) {
    totalFixed++;
  }
});

console.log(`\n✨ Terminé ! ${totalFixed} fichiers corrigés.`);