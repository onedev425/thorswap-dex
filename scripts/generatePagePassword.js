/**
 * use crypto HMAC512 with key 'I!(G#s@1ADgjAlcSW!@()GF#(!@' and message as user prompt
 */

const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter password: ', (answer) => {
  const hash = crypto.createHmac('sha512', 'I!(G#s@1ADgjAlcSW!@()GF#(!@')
                   .update(answer)
                   .digest('hex');

  console.log(hash.toString().slice(-10));
  rl.close();
})
