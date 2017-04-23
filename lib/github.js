const config = require('../config.json');
const crypto = require('crypto');
const http = require('http');
const request = require('request');

/**
 * Generates the secret that is optional for github
 * @param  {JSON} req The values that are sent in from the server
 * @param  {JSON} res The secret value that is returned from the server to be sent to github.
 */
exports.generateSecret = (req, res) => {
  console.log("generateing a secret");
  const clientIp = req.connection.remoteAddress;
  const clientId = req.body.clientId;
  const salt = config.salt;
  const data = clientId + salt;
  console.log(data);
  const hash = crypto.createHash('md5').update(data).digest('hex');
  res.send({ secret: hash });
};

exports.getAccessToken = (req, res) => {
  const temporaryCode = req.body.code;
  const secret = req.body.secret;
  var options = {
  uri: "https://github.com/login/oauth/access_token",
  method: 'POST',
  json: {
    "client_id": config.client_id,
    "client_secret": config.client_secret,
    "code": temporaryCode,
    "state": secret  }
};
  console.log(temporaryCode);
  console.log(secret);
  request.post(options, function(error, response, body) {
    const gitResponse = response.toJSON()
    if(gitResponse.statusCode == 200){
      console.log(response.toJSON());
      res.send({token: gitResponse.body.access_token});
    }

  });
};
