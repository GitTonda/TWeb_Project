const mongoose = require('mongoose');

const connect_DB = async () => {
    try
    {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error)
    {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connect_DB;