const fs = require('fs/promises');
const path = require('path');

async function buildPage() {
  const projectDistDir = path.join(__dirname, 'project-dist');
  const templateFilePath = path.join(__dirname, 'template.html');
  const componentsDir = path.join(__dirname, 'components');
  const stylesDir = path.join(__dirname, 'styles');
  const assetsDir = path.join(__dirname, 'assets');
  const assetsDistDir = path.join(projectDistDir, 'assets');

  try {
    await fs.mkdir(projectDistDir, { recursive: true });

    await processTemplate(templateFilePath, componentsDir, projectDistDir);

    await mergeStyles(stylesDir, projectDistDir);

    await copyDir(assetsDir, assetsDistDir);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function processTemplate(
  templateFilePath,
  componentsDir,
  projectDistDir,
) {
  let templateContent = await fs.readFile(templateFilePath, 'utf-8');
  const componentTags = templateContent.match(/{{\w+}}/g) || [];

  for (const tag of componentTags) {
    const componentName = tag.slice(2, -2);
    const componentFilePath = path.join(componentsDir, `${componentName}.html`);
    const componentContent = await fs.readFile(componentFilePath, 'utf-8');
    templateContent = templateContent.replace(
      new RegExp(tag, 'g'),
      componentContent,
    );
  }

  const outputFilePath = path.join(projectDistDir, 'index.html');
  await fs.writeFile(outputFilePath, templateContent);
}

async function mergeStyles(stylesDir, projectDistDir) {
  const files = await fs.readdir(stylesDir, { withFileTypes: true });
  let cssContent = '';

  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const filePath = path.join(stylesDir, file.name);
      const data = await fs.readFile(filePath, 'utf-8');
      cssContent += data + '\n';
    }
  }

  const bundlePath = path.join(projectDistDir, 'style.css');
  await fs.writeFile(bundlePath, cssContent);
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

buildPage();
