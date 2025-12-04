/**
 * Path Aliases Configuration
 * This file sets up path aliases for cleaner imports
 * Usage: require('@/core/utils/asyncHandler')
 */

const moduleAlias = require('module-alias');
const path = require('path');

// Get the project root directory
const rootPath = path.resolve(__dirname, '..');

// Register aliases
moduleAlias.addAliases({
  '@': rootPath,
  '@core': path.join(rootPath, 'core'),
  '@level1': path.join(rootPath, 'level1'),
  '@level2': path.join(rootPath, 'level2'),
  '@level3': path.join(rootPath, 'level3'),
  '@models': path.join(rootPath, 'models')
});

module.exports = moduleAlias;

