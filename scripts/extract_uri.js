const fs = require('fs');
const path = require('path');

try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/mongodb\+srv:\/\/[^\s"'<>;]+/);
    if (match) {
        fs.writeFileSync('extracted_uri.txt', match[0]);
        console.log('URI extracted to extracted_uri.txt');
    } else {
        console.log('No URI found');
        // Try to dump the first 200 chars if regex fails
        fs.writeFileSync('extracted_uri.txt', envContent.substring(0, 200));
    }
} catch (err) {
    console.error(err);
}
