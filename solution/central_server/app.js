const express = require('express');
const cors = require('cors');
const path = require('path');
const swagger_ui = require('swagger-ui-express');
const swagger_js_doc = require('swagger-jsdoc');
const {engine} = require('express-handlebars');

const app = express();

const swagger_options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Central Gateway API',
            version: '1.0.0',
            description: 'API documentation for the Anime Data Explorer Central Server',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
    apis: [path.join(__dirname, './routes/*.js')],
};

const swagger_docs = swagger_js_doc(swagger_options);
app.use('/api-docs', swagger_ui.serve, swagger_ui.setup(swagger_docs));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', require('./routes/index_routes'));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

module.exports = app;