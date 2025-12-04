/**
 * Script para actualizar todas las importaciones a usar alias
 * Ejecutar: node scripts/updateImports.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, '..', 'src');

// Patrones de reemplazo
const replacements = [
  // Core imports
  {
    pattern: /require\(['"]\.\.\/\.\.\/\.\.\/core\//g,
    replacement: "require('@core/"
  },
  {
    pattern: /require\(['"]\.\.\/\.\.\/core\//g,
    replacement: "require('@core/"
  },
  {
    pattern: /require\(['"]\.\.\/core\//g,
    replacement: "require('@core/"
  },
  // Models imports
  {
    pattern: /require\(['"]\.\.\/\.\.\/\.\.\/models\//g,
    replacement: "require('@models/"
  },
  {
    pattern: /require\(['"]\.\.\/\.\.\/models\//g,
    replacement: "require('@models/"
  },
  {
    pattern: /require\(['"]\.\.\/models\//g,
    replacement: "require('@models/"
  },
  // Level imports
  {
    pattern: /require\(['"]\.\.\/\.\.\/\.\.\/level1\//g,
    replacement: "require('@level1/"
  },
  {
    pattern: /require\(['"]\.\.\/\.\.\/level1\//g,
    replacement: "require('@level1/"
  },
  {
    pattern: /require\(['"]\.\.\/\.\.\/\.\.\/level2\//g,
    replacement: "require('@level2/"
  },
  {
    pattern: /require\(['"]\.\.\/\.\.\/level2\//g,
    replacement: "require('@level2/"
  },
  {
    pattern: /require\(['"]\.\.\/\.\.\/\.\.\/level3\//g,
    replacement: "require('@level3/"
  },
  {
    pattern: /require\(['"]\.\.\/\.\.\/level3\//g,
    replacement: "require('@level3/"
  }
];

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  replacements.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let updatedCount = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      updatedCount += walkDir(filePath);
    } else if (file.endsWith('.js')) {
      if (updateFile(filePath)) {
        console.log(`✅ Updated: ${filePath.replace(srcDir, 'src')}`);
        updatedCount++;
      }
    }
  });

  return updatedCount;
}

console.log('🔄 Actualizando importaciones a usar alias...\n');
const count = walkDir(srcDir);
console.log(`\n✅ ${count} archivos actualizados`);

