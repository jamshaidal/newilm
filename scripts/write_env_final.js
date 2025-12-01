const fs = require('fs');
const path = require('path');

const content = `MONGO_URI=mongodb+srv://jamshaidofficialtv_db_user:vPFvBCVwt5XO7zYb@jamshaid.sjpehi4.mongodb.net/?appName=jamshaid
ADMIN_EMAIL=alilmacadmy@gmail.com
ADMIN_PASSWORD=*Aa786Aa#
`;

try {
    fs.writeFileSync('.env', content);
    console.log('.env written successfully');
} catch (err) {
    console.error(err);
}
