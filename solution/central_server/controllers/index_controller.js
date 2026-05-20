const axios = require('axios');

exports.render_home = async (req, res) =>
{
    let platform_stats = {
        total_anime: "///",
        total_users: "///",
        total_ratings: "///"
    };

    res.render('home', {
        title: 'Anime Data Explorer - Dashboard',
        stats: platform_stats
    });
};

exports.searchAnime = async (req, res) =>
{
    const query = req.query.q;
    let results = [];
    let error_msg = null;

    if (query)
    {
        try
        {
            const response = await axios.get(`http://localhost:8080/api/search?q=${query}`);
            if (response.data.success) results = response.data.data;
        }
        catch (error)
        {
            console.error("Search failed:", error.message);
            error_msg = "Could not reach the PostgreSQL database.";
        }
    }

    res.render('search_results', {
        title: 'Fan Hub - Anime Search',
        query: query,
        results: results,
        error_msg: error_msg
    });
};