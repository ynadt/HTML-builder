const fs = require('fs/promises');
const path = require('path');

async function copyDir() {
  try {
    const sourceDir = path.join(__dirname, 'files');
    const destinationDir = path.join(__dirname, 'files-copy');

    await fs.mkdir(destinationDir, { recursive: true });
    const existingFiles = await fs.readdir(destinationDir);
    await Promise.all(
      existingFiles.map((file) => fs.rm(path.join(destinationDir, file))),
    );

    const files = await fs.readdir(sourceDir);

    for (const file of files) {
      const sourceFile = path.join(sourceDir, file);
      const destinationFile = path.join(destinationDir, file);
      await fs.copyFile(sourceFile, destinationFile);
    }
  } catch (error) {
    console.error('Error during directory copy:', error);
  }
}

copyDir();
