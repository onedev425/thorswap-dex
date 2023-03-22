const crypto = require('crypto');
const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const hashSalt = 'I!(G#s@1ADgjAlcSW!@()GF#(!@'

rl.question('Enter password: ', (answer) => {
  const hash = crypto.createHmac('sha512', hashSalt)
                   .update(answer)
                   .digest('hex');

  console.log("Here is your next password which you have to replace in `src/index.jsx`");
  console.log(`\x1b[32m\x1b[1m${hash.slice(-10)}\x1b[0m`);
  exec(`echo ${hash.slice(-10)} | pbcopy`);
  console.log(`\x1b[33m\x1b[1mPassword has been copied to clipboard\x1b[0m`);

  rl.close();
});
