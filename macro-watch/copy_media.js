const fs = require('fs');
const path = require('path');

const brainDir = "C:\\Users\\bspar\\.gemini\\antigravity-ide\\brain\\64d67911-fd5a-49d4-a708-a3a7ee3d17c5";
const destDir = "C:\\Users\\bspar\\OneDrive\\Desktop\\MANCRO\\macro-watch\\public";

console.log("Brain dir exists:", fs.existsSync(brainDir));
if (fs.existsSync(brainDir)) {
  const files = fs.readdirSync(brainDir);
  console.log("All files in brain dir:", files);
  files.forEach(file => {
    if (file.startsWith('media__')) {
      const srcPath = path.join(brainDir, file);
      const destPath = path.join(destDir, file);
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} to ${destPath}`);
    }
  });
} else {
  console.log("Brain dir not found.");
}
