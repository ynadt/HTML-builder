const fs = require('fs/promises');
const path = require('path');

async function displayFileInfo(directoryPath) {
  try {
    const files = await fs.readdir(directoryPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(directoryPath, file.name);
        const stats = await fs.stat(filePath);
        const fileSize = stats.size;
        const fileExtension = path.extname(file.name).slice(1);
        const fileName = path.basename(file.name, `.${fileExtension}`);
        console.log(`${fileName} - ${fileExtension} - ${fileSize} bytes`);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
}

const directoryPath = path.join(__dirname, 'secret-folder');
displayFileInfo(directoryPath);
