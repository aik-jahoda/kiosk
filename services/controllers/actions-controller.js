/*
 * Actions Controller
 *
 * Serves requests to /actions
 */

'use strict';

const express = require('express');
const router = express.Router();
const userAgent = require('../models/user-agent');

/**
 * Loads a URL as content inside kiosk's system chrome.
 */
router.post('/go', function(request, response) {
  if (request.body) {
    var url = request.body;
    userAgent.go(url);
    response.status(201).json(url);
  } else {
    response.status(400).send();
  }
});

module.exports = router;
