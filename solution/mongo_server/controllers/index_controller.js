const rating = require("../models/rating");

exports.test_ratings = async (req, res) =>
{
    try
    {
        const sample_rating = await rating.findOne();
        if (!sample_rating) return res.status(404).json({ success: false, message: "Failed to find rating" });
        res.json({ success: true, message: "Successfully retrieved one rating" });
    }
    catch (error)
    {
        res.status(500).json({ success: false, error: error.message });
    }
};