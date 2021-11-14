const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { domain, audience } = require("./auth-config");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
  }),
  
  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ["RS256"],
});


function lookJwt() {
  return (req, res, next) =>{ 
    const token = req.headers.authorization

    console.log('token: ', token)
    return next()
  }
}
module.exports = {
  checkJwt,
  lookJwt,
};