const express = require('express');
const router = express.Router();
const index_controller = require('../controllers/index_controller');

/**
 * @swagger
 * /:
 *  get:
 *    summary: Renders the main dashboard
 *    description: Fetches data from Mongo and Postgres microservices and renders the Handlebars home view.
 *    responses:
 *      200:
 *        description: Successfully rendered the HTML page.
 *      500:
 *        description: Internal server error if microservices fail entirely.
 */
router.get('/', index_controller.render_home);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Search for Anime
 *     description: Acts as a proxy, passing a search query to the Postgres microservice to find matching anime titles.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           required: true
 *         description: The title or partial title of the anime to search for.
 *     responses:
 *       200:
 *         description: Successfully retrieved search results and rendered the view.
 *       500:
 *         description: The Postgres microservice is unreachable or threw an error.
 */
router.get('/search', index_controller.searchAnime);

module.exports = router;