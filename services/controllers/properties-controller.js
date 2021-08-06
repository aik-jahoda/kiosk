/*
 * Properties Controller
 *
 * Serves requests to /properties
 */

'use strict';

const express = require('express');
const router = express.Router();
const userAgent = require('../models/user-agent');

/**
 * Get current URL being displayed by kiosk.
 */
router.get('/url', (request, response) => {
  response.status(200).json(userAgent.getUrl());
});

module.exports = router;