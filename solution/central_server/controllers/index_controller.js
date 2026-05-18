const axios = require('axios');

exports.render_home = async (req, res) =>
{
    let mongo_data = null;
    let mongo_status = 'Offline (Check Port 4000)';
    let status_color = 'danger';

    try
    {
        const response = await axios.get('http://localhost:4000/api/test-rating');
        if (response.data.success) {
            mongo_data = response.data.data;
            mongo_status = 'Online & Connected';
            status_color = 'success';
        }
    }
    catch (error)
    {
        console.error("Mongo service unreachable:", error.message);
    }

    res.render('home', {
        title: 'Anime Data Explorer',
        message: 'Central Gateway is routing traffic successfully.',
        mongoStatus: mongo_status,
        statusColor: status_color,
        mongoData: mongo_data
    });
};