const fs = require('fs');
const path = require('path');

// Fonction pour remplacer les apostrophes dans un fichier
function fixApostrophesInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Remplacer les apostrophes dans le JSX (entre > et <)
    content = content.replace(/>(.*?)</g, (match, p1) => {
      const fixed = p1
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;')
        .replace(/"/g, '&ldquo;')
        .replace(/"/g, '&rdquo;');
      return `>${fixed}<`;
    });
    
    // Remplacer dans les attributs title, alt, placeholder
    content = content.replace(/(title|alt|placeholder)="([^"]*)"/g, (match, attr, value) => {
      const fixed = value
        .replace(/'/g, '&apos;')
        .replace(/"/g, '&quot;');
      return `${attr}="${fixed}"`;
    });
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Fonction pour parcourir récursivement les dossiers
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
      fixedCount += processDirectory(filePath);
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      if (fixApostrophesInFile(filePath)) {
        fixedCount++;
      }
    }
  });
  
  return fixedCount;
}

// Lancer le script
console.log('🔧 Correction des apostrophes en cours...\n');

const dirsToProcess = ['app', 'components'];
let totalFixed = 0;

dirsToProcess.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`📁 Processing ${dir}/...`);
    totalFixed += processDirectory(dir);
  }
});

console.log(`\n✨ Terminé ! ${totalFixed} fichiers corrigés.`);
console.log('\n💡 Conseil : Vérifiez les modifications avec "git diff" avant de committer.');