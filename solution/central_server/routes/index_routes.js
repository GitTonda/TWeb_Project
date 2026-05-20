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

module.exports = router;