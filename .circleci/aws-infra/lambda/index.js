const fs = require('fs');
const request = require('request');

exports.handler =  async function(event, context) {
	console.log("EVENT: \n" + JSON.stringify(event, null, 2))
  
  
	const url = 'https://security.sensiolabs.org/check_lock';

	var formData = {lock: fs.createReadStream(__dirname + '/composer.lock')};

	var req = request.post(
	  {
		  headers: {
			"Accept": "text/plain",
			"Content-Type": "multipart/form-data"
		  },
		  url: url,
		  formData: formData
	  }, function(err, resp, body) 
	  {
		  if (err) {
			console.log('Error!');
		  } else {
			console.log(resp.statusCode);
			console.log('body is ' + body);
			console.log(JSON.stringify(resp));
		  }
	  }
	);
  
  
  return context.logStreamName
}