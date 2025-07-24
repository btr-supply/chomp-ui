#!/usr/bin/env node

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const distPath = join(__dirname, '../dist');

function verifySourcemaps() {
  console.log('🗺️  Verifying Sourcemaps...\n');

  if (!existsSync(distPath)) {
    console.error('❌ dist directory not found.');
    console.log('💡 Run "bun run build" first.');
    process.exit(1);
  }

  const findings = {
    jsFiles: [],
    cssFiles: [],
    sourcemapFiles: [],
    jsWithSourcemaps: [],
    cssWithSourcemaps: [],
    orphanedSourcemaps: []
  };

  // Recursively scan for files
  function scanDirectory(dirPath) {
    const items = readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = join(dirPath, item.name);

      if (item.isDirectory()) {
        scanDirectory(fullPath);
      } else {
        const ext = extname(item.name);
        const relativePath = fullPath.replace(distPath, '');

        if (ext === '.js') {
          findings.jsFiles.push(relativePath);

          // Check if JS file has sourcemap reference
          try {
            const content = readFileSync(fullPath, 'utf8');
            if (content.includes('//# sourceMappingURL=')) {
              findings.jsWithSourcemaps.push(relativePath);
            }
          } catch (error) {
            console.warn(`⚠️  Could not read ${relativePath}`);
          }
        } else if (ext === '.css') {
          findings.cssFiles.push(relativePath);

          // Check if CSS file has sourcemap reference
          try {
            const content = readFileSync(fullPath, 'utf8');
            if (content.includes('/*# sourceMappingURL=')) {
              findings.cssWithSourcemaps.push(relativePath);
            }
          } catch (error) {
            console.warn(`⚠️  Could not read ${relativePath}`);
          }
        } else if (ext === '.map') {
          findings.sourcemapFiles.push(relativePath);
        }
      }
    }
  }

  scanDirectory(distPath);

  // Find orphaned sourcemaps
  findings.orphanedSourcemaps = findings.sourcemapFiles.filter(mapFile => {
    const originalFile = mapFile.replace('.map', '');
    return ![...findings.jsFiles, ...findings.cssFiles].includes(originalFile);
  });

  // Report findings
  console.log('📊 Sourcemap Analysis:');
  console.log('='.repeat(50));
  console.log(`📄 JavaScript files: ${findings.jsFiles.length}`);
  console.log(`🗺️  JS files with sourcemaps: ${findings.jsWithSourcemaps.length}`);
  console.log(`🎨 CSS files: ${findings.cssFiles.length}`);
  console.log(`🗺️  CSS files with sourcemaps: ${findings.cssWithSourcemaps.length}`);
  console.log(`📍 Total sourcemap files: ${findings.sourcemapFiles.length}`);
  console.log(`🚫 Orphaned sourcemaps: ${findings.orphanedSourcemaps.length}`);

  console.log('\n📋 Details:');

  if (findings.jsWithSourcemaps.length > 0) {
    console.log('\n✅ JavaScript files with sourcemaps:');
    findings.jsWithSourcemaps.forEach(file => console.log(`   ${file}`));
  }

  if (findings.cssWithSourcemaps.length > 0) {
    console.log('\n✅ CSS files with sourcemaps:');
    findings.cssWithSourcemaps.forEach(file => console.log(`   ${file}`));
  }

  if (findings.orphanedSourcemaps.length > 0) {
    console.log('\n⚠️  Orphaned sourcemap files:');
    findings.orphanedSourcemaps.forEach(file => console.log(`   ${file}`));
  }

  // Missing sourcemaps
  const jsMissingSourcemaps = findings.jsFiles.filter(
    file => !findings.jsWithSourcemaps.includes(file)
  );
  const cssMissingSourcemaps = findings.cssFiles.filter(
    file => !findings.cssWithSourcemaps.includes(file)
  );

  if (jsMissingSourcemaps.length > 0) {
    console.log('\n❌ JavaScript files missing sourcemaps:');
    jsMissingSourcemaps.forEach(file => console.log(`   ${file}`));
  }

  if (cssMissingSourcemaps.length > 0) {
    console.log('\n❌ CSS files missing sourcemaps:');
    cssMissingSourcemaps.forEach(file => console.log(`   ${file}`));
  }

  // Summary
  console.log('\n' + '='.repeat(50));

  const hasIssues =
    jsMissingSourcemaps.length > 0 ||
    cssMissingSourcemaps.length > 0 ||
    findings.orphanedSourcemaps.length > 0;

  if (hasIssues) {
    console.log('❌ Sourcemap verification failed');
    console.log('\n💡 To fix sourcemap issues:');
    console.log('   • Enable sourcemaps in next.config.js');
    console.log('   • Check webpack configuration');
    console.log('   • Remove orphaned .map files');
    process.exit(1);
  } else {
    console.log('✅ All sourcemaps are properly configured');
  }
}

try {
  verifySourcemaps();
} catch (error) {
  console.error('❌ Error verifying sourcemaps:', error.message);
  process.exit(1);
}
