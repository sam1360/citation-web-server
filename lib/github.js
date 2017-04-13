const config = require('../config.json')
const crypto = require('crypto');
const 

/**
 * Generates the secret that is optional for github
 * @param  {JSON} req The values that are sent in from the server
 * @param  {JSON} res The secret value that is returned from the server to be sent to github.
 */
exports.generateSecret = (req, res) => {
  const clientIp = req.connection.remoteAddress;
  const clientId = req.body.clientId;
  const salt = config.salt;
  const hash = crypto.createHash('md5').update(clientIp + clientId + salt).digest('hex');
  res.send({"secret": hash});
};

exports.getAccessToken = (req, res) => {
  const temporaryCode = req.body.code;
  const secret = req.body.secret;

  const postData = querystring.stringify({
    'client_id': config.client_id,
    'client_secret': config.client_secret,
    'code': temporaryCode,
    'state': secret
  });

  const options = {
    hostname: 'https://github.com/',
    path: 'login/oauth/access_token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      console.log('No more data in response.');
    });
  });

  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  // write data to request body
  req.write(postData);
  req.end();
};