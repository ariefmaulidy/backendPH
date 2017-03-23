var api_key = 'key-6e2d028351bdea7aa5e76282cd516ddd';
var domain = 'sandbox58dc25fa58af4f508ba01fec218ce6e4.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
var data = {
  from: 'NugrohoAC <postmaster@sandbox58dc25fa58af4f508ba01fec218ce6e4.mailgun.org>',
  to: 'nugrohoac96@yahoo.com',
  subject: 'Hello',
  text: 'asoooeee'
};
 
mailgun.messages().send(data, function (error, body) {
  console.log(body, data);
});