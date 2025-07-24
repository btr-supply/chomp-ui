#!/usr/bin/env node

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, extname } from 'path';
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

function calculateGzipEstimate(content) {
  // Rough gzip compression estimate (typically 70-80% reduction for text)
  const textContent = typeof content === 'string' ? content : content.toString();
  const estimatedGzipSize = Math.round(textContent.length * 0.3);
  return estimatedGzipSize;
}

function analyzePerformance() {
  console.log('⚡ Performance Analysis\n');

  if (!existsSync(distPath)) {
    console.error('❌ dist directory not found.');
    console.log('💡 Run "bun run build" first.');
    process.exit(1);
  }

  const analysis = {
    totalFiles: 0,
    totalSize: 0,
    jsFiles: [],
    cssFiles: [],
    imageFiles: [],
    otherFiles: [],
    largeFiles: [],
    performanceIssues: []
  };

  function scanDirectory(dirPath) {
    const items = readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = join(dirPath, item.name);

      if (item.isDirectory()) {
        scanDirectory(fullPath);
      } else {
        analysis.totalFiles++;
        const stats = statSync(fullPath);
        const size = stats.size;
        analysis.totalSize += size;

        const ext = extname(item.name).toLowerCase();
        const relativePath = fullPath.replace(distPath, '');

        const fileInfo = {
          path: relativePath,
          size,
          formatted: formatBytes(size)
        };

        // Categorize files
        if (['.js', '.mjs'].includes(ext)) {
          // Check for potential performance issues in JS files
          if (size > 250000) {
            // 250KB
            analysis.largeFiles.push({ ...fileInfo, type: 'JavaScript' });
            analysis.performanceIssues.push(
              `Large JavaScript file: ${relativePath} (${fileInfo.formatted})`
            );
          }

          // Estimate gzip size for JS files
          try {
            const content = readFileSync(fullPath, 'utf8');
            const gzipEstimate = calculateGzipEstimate(content);
            fileInfo.gzipEstimate = formatBytes(gzipEstimate);

            // Check for common performance issues
            if (content.includes('console.log') && !content.includes('NODE_ENV')) {
              analysis.performanceIssues.push(`Console logs found in: ${relativePath}`);
            }
            if (content.includes('debugger')) {
              analysis.performanceIssues.push(`Debugger statements found in: ${relativePath}`);
            }
          } catch (error) {
            // Ignore read errors for binary files
          }

          analysis.jsFiles.push(fileInfo);
        } else if (ext === '.css') {
          if (size > 100000) {
            // 100KB
            analysis.largeFiles.push({ ...fileInfo, type: 'CSS' });
            analysis.performanceIssues.push(
              `Large CSS file: ${relativePath} (${fileInfo.formatted})`
            );
          }

          try {
            const content = readFileSync(fullPath, 'utf8');
            const gzipEstimate = calculateGzipEstimate(content);
            fileInfo.gzipEstimate = formatBytes(gzipEstimate);
          } catch (error) {
            // Ignore read errors
          }

          analysis.cssFiles.push(fileInfo);
        } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'].includes(ext)) {
          if (size > 500000) {
            // 500KB
            analysis.largeFiles.push({ ...fileInfo, type: 'Image' });
            analysis.performanceIssues.push(
              `Large image file: ${relativePath} (${fileInfo.formatted})`
            );
          }
          analysis.imageFiles.push(fileInfo);
        } else {
          analysis.otherFiles.push(fileInfo);
        }
      }
    }
  }

  scanDirectory(distPath);

  // Sort files by size
  analysis.jsFiles.sort((a, b) => b.size - a.size);
  analysis.cssFiles.sort((a, b) => b.size - a.size);
  analysis.imageFiles.sort((a, b) => b.size - a.size);

  // Report results
  console.log('📊 Build Statistics:');
  console.log('='.repeat(60));
  console.log(`📁 Total files: ${analysis.totalFiles}`);
  console.log(`📦 Total size: ${formatBytes(analysis.totalSize)}`);
  console.log(`📄 JavaScript files: ${analysis.jsFiles.length}`);
  console.log(`🎨 CSS files: ${analysis.cssFiles.length}`);
  console.log(`🖼️  Image files: ${analysis.imageFiles.length}`);
  console.log(`📋 Other files: ${analysis.otherFiles.length}`);

  // JavaScript analysis
  if (analysis.jsFiles.length > 0) {
    console.log('\n🚀 JavaScript Performance:');
    console.log('─'.repeat(40));
    const totalJSSize = analysis.jsFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`Total JS size: ${formatBytes(totalJSSize)}`);

    console.log('\n📋 Top JavaScript files:');
    analysis.jsFiles.slice(0, 5).forEach((file, index) => {
      const gzipInfo = file.gzipEstimate ? ` (gzip: ~${file.gzipEstimate})` : '';
      console.log(`${index + 1}. ${file.path} - ${file.formatted}${gzipInfo}`);
    });
  }

  // CSS analysis
  if (analysis.cssFiles.length > 0) {
    console.log('\n🎨 CSS Performance:');
    console.log('─'.repeat(40));
    const totalCSSSize = analysis.cssFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`Total CSS size: ${formatBytes(totalCSSSize)}`);

    if (analysis.cssFiles.length > 0) {
      console.log('\n📋 CSS files:');
      analysis.cssFiles.forEach((file, index) => {
        const gzipInfo = file.gzipEstimate ? ` (gzip: ~${file.gzipEstimate})` : '';
        console.log(`${index + 1}. ${file.path} - ${file.formatted}${gzipInfo}`);
      });
    }
  }

  // Image analysis
  if (analysis.imageFiles.length > 0) {
    console.log('\n🖼️  Image Performance:');
    console.log('─'.repeat(40));
    const totalImageSize = analysis.imageFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(`Total image size: ${formatBytes(totalImageSize)}`);

    if (analysis.imageFiles.length > 0) {
      console.log('\n📋 Largest images:');
      analysis.imageFiles.slice(0, 5).forEach((file, index) => {
        console.log(`${index + 1}. ${file.path} - ${file.formatted}`);
      });
    }
  }

  // Performance issues
  if (analysis.performanceIssues.length > 0) {
    console.log('\n⚠️  Performance Issues:');
    console.log('─'.repeat(40));
    analysis.performanceIssues.forEach(issue => {
      console.log(`❌ ${issue}`);
    });
  }

  // Recommendations
  console.log('\n💡 Performance Recommendations:');
  console.log('─'.repeat(40));

  const totalMB = analysis.totalSize / (1024 * 1024);

  if (analysis.largeFiles.length > 0) {
    console.log('📦 Large files detected:');
    console.log('   • Consider code splitting for large JS files');
    console.log('   • Optimize images (WebP format, compression)');
    console.log('   • Use dynamic imports for heavy libraries');
  }

  if (analysis.jsFiles.length > 10) {
    console.log('🔄 Many JavaScript files:');
    console.log('   • Consider bundling strategy optimization');
    console.log('   • Review chunk splitting configuration');
  }

  if (totalMB > 5) {
    console.log('📊 Large bundle size:');
    console.log('   • Enable gzip compression on server');
    console.log('   • Consider tree shaking optimization');
    console.log('   • Remove unused dependencies');
  }

  if (analysis.performanceIssues.length === 0 && totalMB < 3) {
    console.log('✅ Build looks well optimized!');
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Overall Score: ${getPerformanceScore(analysis)}/100`);
}

function getPerformanceScore(analysis) {
  let score = 100;

  // Deduct points for large bundle
  const totalMB = analysis.totalSize / (1024 * 1024);
  if (totalMB > 10) score -= 30;
  else if (totalMB > 5) score -= 15;
  else if (totalMB > 3) score -= 5;

  // Deduct points for large files
  score -= Math.min(analysis.largeFiles.length * 10, 30);

  // Deduct points for performance issues
  score -= Math.min(analysis.performanceIssues.length * 5, 20);

  // Deduct points for too many JS files
  if (analysis.jsFiles.length > 20) score -= 10;
  else if (analysis.jsFiles.length > 10) score -= 5;

  return Math.max(score, 0);
}

try {
  analyzePerformance();
} catch (error) {
  console.error('❌ Error analyzing performance:', error.message);
  process.exit(1);
}
