const axios = require('axios');

exports.render_home = async (req, res) => {
    // 1. Initialize empty data structures
    let platformStats = {
        totalAnime: "28,955", // We know this from the CSV assignment sheet!
        totalUsers: "Loading...",
        totalRatings: "Loading..."
    };
    let topAnimeList = [];
    let errorMsg = null;

    try {
        // TODO: The Data Merging Zone
        // You and your partner will uncomment and build these endpoints next!

        // const statsRes = await axios.get('http://localhost:4000/api/platform-stats');
        // if (statsRes.data.success) platformStats = statsRes.data.data;

        const topAnimeRes = await axios.get('http://localhost:8080/api/top-10-anime');
        if (topAnimeRes.data.success) topAnimeList = topAnimeRes.data.data;

    } catch (error) {
        console.error("❌ Failed to load dashboard data:", error.message);
        errorMsg = "Some analytics services are currently degraded.";
    }

    // 2. Render the Main Dashboard View
    res.render('home', {
        title: 'Anime Data Explorer - Dashboard',
        stats: platformStats,
        topAnime: topAnimeList,
        errorMsg: errorMsg
    });
};

exports.searchAnime = async (req, res) => {
    const query = req.query.q;
    let results = [];
    let errorMsg = null;

    if (query) {
        try {
            const response = await axios.get(`http://localhost:8080/api/search?q=${query}`);

            if (response.data.success) {
                results = response.data.data;
            }
        } catch (error) {
            console.error("❌ Search failed:", error.message);
            errorMsg = "Could not reach the PostgreSQL database.";
        }
    }

    res.render('search_results', {
        title: 'Fan Hub - Anime Search',
        query: query,
        results: results,
        errorMsg: errorMsg
    });
};