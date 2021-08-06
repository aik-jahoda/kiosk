/*
 * Events Controller
 *
 * Serves requests to /events
 */

'use strict';

const express = require('express');
const userAgent = require('../models/user-agent');
const router = express.Router();

/**
 * Handle event subscriptions.
 */
router.get('/:eventName', (request, response) => {
  if (!request.accepts('text/event-stream')) {
    return;
  }

  const eventName = request.params.eventName;

  // Keep the socket open
  request.socket.setKeepAlive(true);
  // Prevent Nagle's algorithm from trying to optimise throughput
  request.socket.setNoDelay(true);
  // Disable inactivity timeout on the socket
  request.socket.setTimeout(0);

  // Set event stream content type
  response.setHeader('Content-Type', 'text/event-stream');
  // Disable caching and compression
  response.setHeader('Cache-Control', 'no-cache,no-transform');
  // Tell client to keep the connection alive
  response.setHeader('Connection', 'keep-alive');
  // Set 200 OK response
  response.status(200);
  // Send headers to complete the connection, but don't end the response
  response.flushHeaders();

  // Event listener
  function handleEvent(data) {
    const eventId = Date.now();
    
    // Push event to client via event stream
    response.write(`id: ${eventId}\n`);
    response.write(`event: ${eventName}\n`);
    response.write(`data: ${data}\n\n`);
  }

  // Listen for events of given type
  userAgent.on(eventName, handleEvent);

  // Stop listening if connection is closed
  response.on('close', () => {
    userAgent.removeListener(eventName, handleEvent);
  });

});

module.exports = router;