const fs = require('fs');
const path = require('path');

// Corrections spécifiques pour les imports non utilisés
const fixes = {
  'app/admin/login/page.tsx': {
    remove: [],
    comment: ['err'] // On va commenter cette ligne
  },
  'app/admin/montantes/[id]/editer/page.tsx': {
    remove: ['VALIDATION']
  },
  'app/admin/page.tsx': {
    remove: ['router']
  },
  'app/api/admin/reset/route.ts': {
    remove: ['request']
  },
  'app/api/auth/login/route.ts': {
    remove: ['header', 'error']
  },
  'app/api/montantes/[id]/route.ts': {
    remove: ['DetailsMatchs']
  },
  'app/api/montantes/route.ts': {
    remove: ['verifierObjectifAtteint']
  },
  'app/montante/[id]/page.tsx': {
    remove: ['formatCote']
  },
  'app/page.tsx': {
    remove: ['Link']
  },
  'components/StatsCard.tsx': {
    remove: ['formatEuro']
  },
  'components/TableauMeilleuresMontantes.tsx': {
    remove: ['formatEuro']
  },
  'components/admin/ValidationMatchsCombine.tsx': {
    remove: ['palierId', 'index']
  },
  'lib/prisma.ts': {
    remove: ['variation']
  }
};

function removeUnusedImports(filePath, importsToRemove) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    importsToRemove.forEach(importName => {
      // Regex pour trouver l'import
      const importRegex = new RegExp(`(^|\\n)import.*?\\b${importName}\\b.*?from.*?;`, 'gm');
      const destructuredRegex = new RegExp(`(,\\s*)?\\b${importName}\\b(\\s*,)?`, 'g');
      
      // Vérifier si c'est un import complet ou destructuré
      const match = content.match(importRegex);
      if (match) {
        // Si c'est un import simple, on le supprime
        if (match[0].includes(`import ${importName} from`)) {
          content = content.replace(importRegex, '');
          modified = true;
        } else {
          // Si c'est un import destructuré, on supprime juste la variable
          content = content.replace(destructuredRegex, (match, before, after) => {
            if (before && after) return ','; // Garder une virgule si au milieu
            return '';
          });
          modified = true;
        }
      }
      
      // Nettoyer les imports vides
      content = content.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"]\s*;?\s*\n/g, '');
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed imports in: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Exécuter les corrections
console.log('🔧 Correction des imports non utilisés...\n');

let totalFixed = 0;
Object.entries(fixes).forEach(([file, config]) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath) && removeUnusedImports(filePath, config.remove)) {
    totalFixed++;
  }
});

console.log(`\n✨ Terminé ! ${totalFixed} fichiers corrigés.`);