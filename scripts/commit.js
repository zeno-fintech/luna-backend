#!/usr/bin/env node

/**
 * Script de Commit Automático
 * 
 * Este script genera un commit automático basado en los cambios detectados en git.
 * Uso: yarn commit o npm run commit
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    return status.trim().split('\n').filter(line => line.trim());
  } catch (error) {
    log('❌ Error al obtener el estado de git', 'red');
    process.exit(1);
  }
}

function getStagedFiles() {
  try {
    const files = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
    return files.trim().split('\n').filter(line => line.trim());
  } catch (error) {
    return [];
  }
}

function categorizeChanges(files) {
  const categories = {
    feat: [],
    fix: [],
    docs: [],
    refactor: [],
    style: [],
    test: [],
    chore: [],
    config: []
  };

  files.forEach(file => {
    const lowerFile = file.toLowerCase();
    
    if (lowerFile.includes('test') || lowerFile.includes('spec')) {
      categories.test.push(file);
    } else if (lowerFile.includes('readme') || lowerFile.includes('.md') || lowerFile.includes('docs')) {
      categories.docs.push(file);
    } else if (lowerFile.includes('package.json') || lowerFile.includes('.env') || lowerFile.includes('config')) {
      categories.config.push(file);
    } else if (lowerFile.includes('controller') || lowerFile.includes('service') || lowerFile.includes('route')) {
      if (lowerFile.includes('fix') || lowerFile.includes('error') || lowerFile.includes('bug')) {
        categories.fix.push(file);
      } else {
        categories.feat.push(file);
      }
    } else if (lowerFile.includes('model') || lowerFile.includes('schema')) {
      categories.feat.push(file);
    } else if (lowerFile.includes('middleware') || lowerFile.includes('utils')) {
      categories.refactor.push(file);
    } else if (lowerFile.includes('script')) {
      categories.chore.push(file);
    } else {
      categories.feat.push(file);
    }
  });

  return categories;
}

function generateCommitMessage(categories) {
  const messages = [];
  
  // Contar cambios por categoría
  const counts = {};
  Object.keys(categories).forEach(key => {
    if (categories[key].length > 0) {
      counts[key] = categories[key].length;
    }
  });

  // Determinar el tipo de commit principal
  let mainType = 'feat';
  let mainCount = 0;
  
  Object.keys(counts).forEach(key => {
    if (counts[key] > mainCount) {
      mainCount = counts[key];
      mainType = key;
    }
  });

  // Generar mensaje principal
  const typeLabels = {
    feat: '✨ Nueva funcionalidad',
    fix: '🐛 Corrección de bug',
    docs: '📚 Documentación',
    refactor: '♻️ Refactorización',
    style: '💄 Estilo',
    test: '🧪 Tests',
    chore: '🔧 Mantenimiento',
    config: '⚙️ Configuración'
  };

  const mainLabel = typeLabels[mainType] || '✨ Cambios';
  
  // Generar descripción detallada
  const descriptions = [];
  
  if (categories.feat.length > 0) {
    const features = categories.feat.filter(f => 
      !f.includes('test') && !f.includes('spec') && !f.includes('.md')
    );
    if (features.length > 0) {
      descriptions.push(`Agregadas ${features.length} funcionalidad(es)`);
    }
  }
  
  if (categories.fix.length > 0) {
    descriptions.push(`Corregidos ${categories.fix.length} bug(s)`);
  }
  
  if (categories.docs.length > 0) {
    descriptions.push(`Actualizada documentación (${categories.docs.length} archivo(s))`);
  }
  
  if (categories.config.length > 0) {
    descriptions.push(`Actualizada configuración (${categories.config.length} archivo(s))`);
  }

  const description = descriptions.length > 0 
    ? descriptions.join(', ')
    : `${mainCount} archivo(s) modificado(s)`;

  return `${mainLabel}: ${description}`;
}

function main() {
  log('\n🚀 Script de Commit Automático', 'bright');
  log('================================\n', 'cyan');

  // Verificar que estamos en un repositorio git
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
  } catch (error) {
    log('❌ No se encontró un repositorio git', 'red');
    process.exit(1);
  }

  // Obtener archivos modificados
  const status = getGitStatus();
  
  if (status.length === 0) {
    log('✅ No hay cambios para commitear', 'green');
    process.exit(0);
  }

  log(`📝 Archivos modificados: ${status.length}`, 'yellow');
  
  // Mostrar archivos modificados
  status.forEach(file => {
    const status = file.substring(0, 2);
    const filename = file.substring(3);
    const color = status.includes('??') ? 'cyan' : status.includes('M') ? 'yellow' : 'green';
    log(`   ${status} ${filename}`, color);
  });

  // Agregar todos los archivos
  log('\n📦 Agregando archivos al staging...', 'blue');
  try {
    execSync('git add .', { stdio: 'inherit' });
    log('✅ Archivos agregados correctamente', 'green');
  } catch (error) {
    log('❌ Error al agregar archivos', 'red');
    process.exit(1);
  }

  // Obtener archivos en staging
  const stagedFiles = getStagedFiles();
  
  if (stagedFiles.length === 0) {
    log('⚠️ No hay archivos en staging', 'yellow');
    process.exit(0);
  }

  // Categorizar cambios
  const categories = categorizeChanges(stagedFiles);
  
  // Generar mensaje de commit
  const commitMessage = generateCommitMessage(categories);
  
  log('\n💬 Mensaje de commit generado:', 'bright');
  log(`   ${commitMessage}\n`, 'cyan');

  // Confirmar commit
  log('🔄 Realizando commit...', 'blue');
  try {
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    log('\n✅ Commit realizado exitosamente!', 'green');
    log(`   Mensaje: ${commitMessage}`, 'cyan');
  } catch (error) {
    log('\n❌ Error al realizar commit', 'red');
    log('   Puede que necesites configurar git user.name y user.email', 'yellow');
    process.exit(1);
  }

  log('\n✨ Proceso completado!\n', 'green');
}

main();

