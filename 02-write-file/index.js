const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'output.txt');
const fileStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Enter text to write to the file. Type "exit" to quit.');

const handleInput = (input) => {
  if (input.trim().toLowerCase() === 'exit') {
    console.log('Goodbye!');
    rl.close();
  } else {
    fileStream.write(input + '\n');
    console.log(
      'Text written to file. Continue typing or type "exit" to quit.',
    );
  }
};

rl.on('line', handleInput);

rl.on('SIGINT', () => {
  console.log('\nGoodbye!');
  rl.close();
});

rl.on('close', () => {
  fileStream.close();
  process.exit(0);
});
