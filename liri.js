var keys = require("./keys.js");
var command = process.argv[2];

switch(command){
	case "my-tweets":
		twitter();
		break;
	case "spotify-this-song":
		spotify(process.argv[3]);
		break;
	default:
		console.log("Enter a proper command")
}

function twitter (){
	//Calls Twitter node package
	var Twitter = require('twitter');

	//Passes twitterKeys into the Twitter NPM (?)
	var client = new Twitter(keys.twitterKeys)
	
	//Creates object is parameters used for the twitter search
	var params = {
		screen_name: 'NUCBimrankazmi', 
		limit: 3
	};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
			tweets.forEach(function(i){
				console.log(`${i.text}. Created at: ${i.created_at} by user ${i.user.screen_name}`);
			})
		}
	})
}

function spotify (songName){
	var Spotify = require('node-spotify-api');
	var client = new Spotify(keys.spotifyKeys);

	if(songName === undefined){
		songName = "The Sign Ace of Base"
	}

	songName = "Despacito";

	//Establish logic to allow query to have spaces for purposes of process.argv[3]
	
	//if no song name given, default to "The Sign" by Ace of Base
	
	//since there are multiple artists to a song - create a for loop that iterates through artists
	//append artists[i].name to a new array
	//print that array as a String and return
	 
	client.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}

		var artists;
		var artistsStr;


		console.log(data.tracks.items[0].album.artists[0])

		// var dataPath = data.tracks.items[0]

		// console.log(`Song: ${dataPath.name}`)
		// console.log(`Artist: ${dataPath.artists[0].name}`)
		// console.log(`Album: ${dataPath.album.name}`)
		// console.log(`Preview: ${dataPath.preview_url}`)

 	})
};