const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\vikur\\.gemini\\antigravity\\brain\\acd2c4d5-ff41-4c23-92d5-392ef6280e20';
const destDir = path.join(__dirname, 'public', 'cities');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map of generated image paths to their required names
const images = {
  'city_gurugram_1787401051650.jpg': 'gurugram.jpg',
  'city_ranchi_1787401063700.jpg': 'ranchi.jpg',
  'city_noida_1787401076412.jpg': 'noida.jpg'
};

let successCount = 0;

Object.entries(images).forEach(([srcName, destName]) => {
  const srcPath = path.join(srcDir, srcName);
  const destPath = path.join(destDir, destName);
  
  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${destName}`);
      successCount++;
    } else {
      console.error(`❌ Could not find source file: ${srcPath}`);
    }
  } catch (err) {
    console.error(`❌ Error copying ${destName}:`, err.message);
  }
});

console.log(`\nDone! Successfully copied ${successCount} city images to public/cities.`);
