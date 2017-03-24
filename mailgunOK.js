var api_key = 'key-beebf37863b91ecb9aa42ead1cbc69d5';
var domain = 'sandbox0b0052c0825a4725aa89c6fff918c060.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
var data = {
  from: 'ASSSOOEEEE <postmaster@sandbox58dc25fa58af4f508ba01fec218ce6e4.mailgun.org>',
  to: 'nugrohoac96@gmail.com',
  subject: 'GEGWEPE',
  text: 'wkwkwkwkwkwkkwkw'
};
 
mailgun.messages().send(data, function (error, body) {
  console.log(body, data);
});