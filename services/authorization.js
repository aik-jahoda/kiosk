'use strict';

const jwt = require('jsonwebtoken');
const credentials = require('./models/credentials');

/**
 * Authorisation middleware.
 *
 * Checks incoming requests for a valid JSON Web Token.
 *
 * Note: So far just JWT-based authentication with blanket authorization for
 * all requests with a verified JWT which go through this middleware.
 *
 * @param {Object} request HTTP request object.
 * @param {Object} response HTTP response object.
 * @param {Object} next Callback.
 */
function middleware(request, response, next) {
  let authorized = authorize(request);
  if (authorized) {
    next();
  } else {
    response.status(401).send('No valid JWT provided.');
  }
}

/**
 * Authorization middleware.
 *
 * Authorizes a request based on its JWT (JSON Web Token).
 *
 * @param {Object} request HTTP request object.
 * @returns {boolean} True if authorized, false if not.
 */
function authorize(request) {
  const token = extractJWT(request);
  if(!token) {
    return false;
  }

  // Get public key to verify JWT
  let publicKey = credentials.getPublicKey();

  // Try to verify JWT
  try {
    var decoded = jwt.verify(token, publicKey);
    return true;
  } catch {
    return false;
  }
}

function extractJWT(request) {
  // Check for JWT in URL query string
  if (typeof request.query === 'object' && request.query.jwt) {
    return request.query.jwt;
  }

  // Check for JWT in Authorization header
  const authorization = request.headers.authorization;
  if (!authorization) {
    return false;
  }
  const [type, token] = authorization.split(' ');
  if (type !== 'Bearer' || !token) {
    return false;
  } else {
    return token;
  }
}


module.exports = {
  middleware,
  authorize
};
