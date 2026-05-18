const path = require('path');
const app = require('./app');
const connect_DB = require('./config/db');
require('dotenv').config({ path: path.join(__dirname, '.env') });

connect_DB();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`mongo_server online at [http://localhost:${PORT}]`);
});