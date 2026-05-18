const axios = require('axios');

exports.render_home = async (req, res) => {
    // 1. Mongo State
    let mongoData = null;
    let mongoStatus = 'Offline (Check Port 4000)';
    let mongoColor = 'danger';

    // 2. Postgres State
    let postgresData = null;
    let postgresStatus = 'Offline (Check Port 8080)';
    let postgresColor = 'danger';

    // Fetch Mongo Data
    try {
        const mongoRes = await axios.get('http://localhost:4000/api/test-rating');
        if (mongoRes.data.success) {
            mongoData = mongoRes.data.data;
            mongoStatus = 'Online & Connected';
            mongoColor = 'success';
        }
    } catch (error) {
        console.error("❌ Mongo service unreachable:", error.message);
    }

    // Fetch Postgres Data
    try {
        const postgresRes = await axios.get('http://localhost:8080/api/test-postgres');
        if (postgresRes.data.success) {
            postgresData = postgresRes.data.data;
            postgresStatus = 'Online & Connected';
            postgresColor = 'primary'; // Let's use blue for Postgres!
        }
    } catch (error) {
        console.error("❌ Postgres service unreachable:", error.message);
    }

    // Render the Dashboard
    res.render('home', {
        title: 'Anime Data Explorer',
        message: 'Central Gateway is routing traffic successfully.',
        mongoStatus, mongoColor, mongoData,
        postgresStatus, postgresColor, postgresData
    });
};