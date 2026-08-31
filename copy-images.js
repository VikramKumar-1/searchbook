const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\vikur\\.gemini\\antigravity\\brain\\acd2c4d5-ff41-4c23-92d5-392ef6280e20';
const destDir = path.join(__dirname, 'public', 'services');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map of generated image paths to their required names
const images = {
  '3d_avatar_maid_1787399998484.jpg': 'maid.jpg',
  '3d_avatar_cook_1787400011783.jpg': 'cook.jpg',
  '3d_avatar_water_1787400025356.jpg': 'water.jpg',
  '3d_avatar_laundry_1787400046452.jpg': 'laundry.jpg',
  '3d_avatar_plumber_1787400061944.jpg': 'plumber.jpg',
  '3d_avatar_electrician_1787400076318.jpg': 'electrician.jpg',
  '3d_avatar_ac_1787400091682.jpg': 'ac.jpg',
  '3d_avatar_ro_1787400107699.jpg': 'ro.jpg'
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

console.log(`\nDone! Successfully copied ${successCount} images to public/services.`);
