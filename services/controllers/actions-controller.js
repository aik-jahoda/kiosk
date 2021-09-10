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
    // Validate URL
    let url;
    try {
      url = new URL(request.body);
    } catch(e) {
      response.status(400).send();
      return;
    }
    // Navigate to URL
    userAgent.go(url.href);
    response.status(200).json({'status': 'completed'});
  } else {
    response.status(400).send();
  }
});

module.exports = router;
