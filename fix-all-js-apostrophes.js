const fs = require('fs');
const path = require('path');

function fixJavaScriptApostrophes(content) {
  // Remplacer &apos; par ' dans TOUTES les expressions JavaScript {}
  let fixed = content;
  let changed = true;
  
  while (changed) {
    const before = fixed;
    // Chercher les expressions entre accolades qui contiennent &apos;
    fixed = fixed.replace(/(\{[^}]*?)&apos;([^}]*?\})/g, "$1'$2");
    changed = before !== fixed;
  }
  
  // Même chose pour &quot;
  changed = true;
  while (changed) {
    const before = fixed;
    fixed = fixed.replace(/(\{[^}]*?)&quot;([^}]*?\})/g, '$1"$2');
    changed = before !== fixed;
  }
  
  return fixed;
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixJavaScriptApostrophes(content);
    
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules' && file !== '.next') {
      count += processDirectory(filePath);
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      if (processFile(filePath)) {
        count++;
      }
    }
  });
  
  return count;
}

console.log('🔧 Correction GLOBALE des apostrophes dans les expressions JavaScript...\n');

const dirs = ['app', 'components', 'lib'];
let totalFixed = 0;

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`📁 Scanning ${dir}/...`);
    totalFixed += processDirectory(dir);
  }
});

console.log(`\n✅ Terminé ! ${totalFixed} fichiers corrigés.`);
console.log('\n📝 Commandes à exécuter :');
console.log('git add .');
console.log('git commit -m "Fix: Correction globale apostrophes JS"');
console.log('git push');