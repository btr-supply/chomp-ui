#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = join(__dirname, '../dist');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeDirectory(dirPath, level = 0) {
  const files = readdirSync(dirPath);
  let totalSize = 0;
  const results = [];

  for (const file of files) {
    const filePath = join(dirPath, file);
    const stats = statSync(filePath);

    if (stats.isDirectory()) {
      const subResults = analyzeDirectory(filePath, level + 1);
      results.push(...subResults.files);
      totalSize += subResults.totalSize;
    } else {
      const size = stats.size;
      totalSize += size;
      results.push({
        path: filePath.replace(distPath, ''),
        size,
        formatted: formatBytes(size)
      });
    }
  }

  return { files: results, totalSize };
}

try {
  console.log('📊 Bundle Size Analysis\n');

  const analysis = analyzeDirectory(distPath);

  // Sort by size (largest first)
  analysis.files.sort((a, b) => b.size - a.size);

  console.log('🗂️  Largest Files:');
  analysis.files.slice(0, 10).forEach((file, index) => {
    console.log(`${index + 1}. ${file.path} - ${file.formatted}`);
  });

  console.log(`\n📈 Total Bundle Size: ${formatBytes(analysis.totalSize)}`);

  // Size recommendations
  const totalMB = analysis.totalSize / (1024 * 1024);
  if (totalMB > 10) {
    console.log('\n⚠️  Bundle size is quite large. Consider:');
    console.log('   • Code splitting with dynamic imports');
    console.log('   • Tree shaking optimization');
    console.log('   • Removing unused dependencies');
  } else if (totalMB > 5) {
    console.log('\n💡 Bundle size is moderate. Monitor growth.');
  } else {
    console.log('\n✅ Bundle size looks good!');
  }
} catch (error) {
  console.error('❌ Error analyzing bundle size:');
  console.error('Make sure to run "bun run build" first');
  console.error(error.message);
  process.exit(1);
}
