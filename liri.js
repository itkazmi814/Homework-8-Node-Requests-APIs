var keys = require("./keys.js");
var command = process.argv[2];

switch(command){
	case "my-tweets":
		twitter();
		break;
	case "spotify-this-song":
		spotify();
		break;
}

function twitter (){
	var Twitter = require('twitter');
	var client = new Twitter(keys.twitterKeys)
	var params = {screen_name: 'NUCBimrankazmi', limit: 3};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			tweets.forEach(function(i){
				console.log("Tweet text: " + i.text);
				console.log("Created at: " + i.created_at);
				console.log("----")
			})
		}
	})
}

function spotify (){
	console.log("entering spotify");
}