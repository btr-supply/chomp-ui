#!/usr/bin/env node

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootDir = dirname(__dirname);
const nextDir = join(rootDir, '.next');
const analyzeDir = join(nextDir, 'analyze');

console.log('📊 Starting Bundle Analyzer...\n');

// Check if .next directory exists
if (!existsSync(nextDir)) {
  console.error('❌ .next directory not found.');
  console.log('💡 Run "bun run build:analyze" first to generate bundle analysis data.');
  process.exit(1);
}

// Check if analysis files exist
if (!existsSync(analyzeDir)) {
  console.log('⚠️  No analysis data found.');
  console.log('📋 Running build with analysis enabled...');

  const buildProcess = spawn('bun', ['run', 'build:analyze'], {
    stdio: 'inherit',
    cwd: rootDir
  });

  buildProcess.on('close', code => {
    if (code === 0) {
      console.log('\n✅ Build complete! Opening analyzer...');
      openAnalyzer();
    } else {
      console.error('❌ Build failed');
      process.exit(1);
    }
  });
} else {
  openAnalyzer();
}

function openAnalyzer() {
  console.log('🌐 Opening bundle analyzer in your browser...');

  const analyzerProcess = spawn(
    'npx',
    ['webpack-bundle-analyzer', join(analyzeDir, 'client.html')],
    {
      stdio: 'inherit',
      cwd: rootDir
    }
  );

  analyzerProcess.on('close', code => {
    console.log(`\n📊 Bundle analyzer ${code === 0 ? 'completed' : 'exited'}`);
  });

  analyzerProcess.on('error', error => {
    console.error('❌ Error starting bundle analyzer:', error.message);
    console.log('💡 Make sure webpack-bundle-analyzer is installed:');
    console.log('   bun add -D webpack-bundle-analyzer');
  });
}
