/**
 * Router routes HTTP requests to appropriate controllers.
 */

'use strict';

const express = require('express');
const path = require('path');
const router = express.Router();
const auth = require('./authorization').middleware;
const loginController = require('./controllers/login-controller');
const propertiesController = require('./controllers/properties-controller');
const actionsController = require('./controllers/actions-controller');
const eventsController = require('./controllers/events-controller');
const settingsController = require('./controllers/settings-controller');

// Enable CORS
router.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  response.setHeader('Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE');
  next();
});

// Parse JSON bodies (disable strict to allow lone strings as valid JSON)
router.use(express.json({strict:false}));
// Serve login requests
router.use('/login', loginController);
// Serve Web of Things property requests
router.use('/properties', auth, propertiesController);
// Serve Web of Things action requests
router.use('/actions', auth, actionsController);
// Serve Web of Things event requests
router.use('/events', auth, eventsController);
// Serve settings requests (authentication handled inside controller)
router.use('/settings', settingsController);
// Serve static files
router.use('/js/lib/dompurify',
  express.static(path.join(__dirname, '..', 'node_modules/dompurify/dist')));
router.use(express.static(path.join(__dirname, 'views')));

module.exports = router;
