const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

try {
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  const lines = envContent.split('\n');
  const newLines = [];
  let mongoUriFound = false;
  let emailFound = false;
  let passwordFound = false;

  for (const line of lines) {
    if (line.trim().startsWith('MONGO_URI=')) {
      newLines.push(line.trim());
      mongoUriFound = true;
    } else if (line.trim().startsWith('ADMIN_EMAIL=')) {
      newLines.push(`ADMIN_EMAIL=alilmacadmy@gmail.com`);
      emailFound = true;
    } else if (line.trim().startsWith('ADMIN_PASSWORD=')) {
      newLines.push(`ADMIN_PASSWORD=*Aa786Aa#`);
      passwordFound = true;
    } else if (line.trim() !== '') {
      // Keep other lines
      newLines.push(line.trim());
    }
  }

  if (!mongoUriFound) {
    // If not found, try to find MONGO_URI in the original content loosely or just add a placeholder if completely missing
    // But based on previous checks, it exists.
    console.log('Warning: MONGO_URI not found in existing .env, checking for other keys...');
  }

  if (!emailFound) {
    newLines.push(`ADMIN_EMAIL=alilmacadmy@gmail.com`);
  }
  if (!passwordFound) {
    newLines.push(`ADMIN_PASSWORD=*Aa786Aa#`);
  }

  fs.writeFileSync(envPath, newLines.join('\n'));
  console.log('Successfully updated .env');

} catch (err) {
  console.error('Error updating .env:', err);
  process.exit(1);
}
