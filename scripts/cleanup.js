#!/usr/bin/env node

/**
 * Kooreh Project Cleanup Script
 * Removes legacy files and organizes the project structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('========================================');
console.log('Kooreh Project Cleanup Script');
console.log('========================================\n');

// Create backup directory
const backupDir = path.join(projectRoot, 'backup-legacy');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
  console.log('✓ Created backup directory');
}

// Move legacy public directory to backup
const publicDir = path.join(projectRoot, 'public');
if (fs.existsSync(publicDir)) {
  const backupPublicDir = path.join(backupDir, 'public');
  if (fs.existsSync(backupPublicDir)) {
    fs.rmSync(backupPublicDir, { recursive: true, force: true });
  }
  fs.renameSync(publicDir, backupPublicDir);
  console.log('✓ Moved public directory to backup');
}

// Create organized directory structure
const directories = [
  'src/js/config',
  'src/js/utils',
  'src/js/services',
  'src/js/components'
];

directories.forEach(dir => {
  const fullPath = path.join(projectRoot, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
});

// Move configuration files
const envExample = path.join(projectRoot, 'env.example');
const configEnvExample = path.join(projectRoot, 'src/js/config/env.example');
if (fs.existsSync(envExample)) {
  fs.copyFileSync(envExample, configEnvExample);
  console.log('✓ Copied env.example to config directory');
}

// Create .env file if it doesn't exist
const envFile = path.join(projectRoot, '.env');
if (!fs.existsSync(envFile) && fs.existsSync(envExample)) {
  fs.copyFileSync(envExample, envFile);
  console.log('✓ Created .env file from template');
}

// Remove temporary files
const tempFiles = [
  '*.tmp',
  '*.log',
  '*.cache',
  '.DS_Store',
  'Thumbs.db'
];

tempFiles.forEach(pattern => {
  // Simple pattern matching for common temp files
  if (pattern === '*.tmp' || pattern === '*.log') {
    const files = fs.readdirSync(projectRoot).filter(file => 
      file.endsWith(pattern.substring(1))
    );
    files.forEach(file => {
      try {
        fs.unlinkSync(path.join(projectRoot, file));
        console.log(`✓ Removed temporary file: ${file}`);
      } catch (error) {
        // Ignore errors for non-existent files
      }
    });
  }
});

// Update .gitignore if needed
const gitignorePath = path.join(projectRoot, '.gitignore');
if (fs.existsSync(gitignorePath)) {
  let gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  
  // Add missing entries if they don't exist
  const additions = [
    '# Environment variables',
    '.env',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
    '',
    '# Build outputs',
    'dist/',
    'build/',
    'out/',
    '',
    '# Firebase',
    '.firebase/',
    'firebase-debug.log',
    'firebase-debug.*.log',
    'serviceAccountKey.json',
    'ui-debug.log'
  ];
  
  additions.forEach(addition => {
    if (!gitignoreContent.includes(addition)) {
      gitignoreContent += '\n' + addition;
    }
  });
  
  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log('✓ Updated .gitignore file');
}

console.log('\n========================================');
console.log('Cleanup Complete!');
console.log('========================================\n');

console.log('What was done:');
console.log('- Legacy public directory moved to backup-legacy/');
console.log('- Organized src/js structure created');
console.log('- Configuration files organized');
console.log('- .env file created from template');
console.log('- .gitignore updated');

console.log('\nNext steps:');
console.log('1. Edit .env file with your actual values');
console.log('2. Review backup-legacy/ for any needed files');
console.log('3. Run \'npm install\' to ensure dependencies');
console.log('4. Run \'npm run dev\' to test the application');

console.log('\nNote: Legacy files are safely backed up in backup-legacy/ directory');
console.log('You can review them and manually restore any needed files.');
