const fs = require('fs/promises');
const path = require('path');

async function mergeStyles() {
  try {
    const stylesDir = path.join(__dirname, 'styles');
    const distDir = path.join(__dirname, 'project-dist');
    const bundlePath = path.join(distDir, 'bundle.css');

    await fs.mkdir(distDir, { recursive: true });

    const files = await fs.readdir(stylesDir, { withFileTypes: true });

    let cssContent = '';
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const filePath = path.join(stylesDir, file.name);
        const data = await fs.readFile(filePath, 'utf-8');
        cssContent += data + '\n';
      }
    }

    await fs.writeFile(bundlePath, cssContent);
  } catch (error) {
    console.error('Error:', error);
  }
}

mergeStyles();
