var keys = require("./keys.js");
var command = process.argv[2];

switch(command){
	case "my-tweets":
		twitter();
		break;
	case "spotify-this-song":
		spotify();
		break;
	default:
		console.log("Enter a proper command")
}

function setSongName () {
	var name = ""
	//Sets song if no value is entered
	if(process.argv[3] === undefined){
		name = "The Sign Ace of Base";
	}else{
		//Appends words of the song together into one string
		for(var i=3; i<process.argv.length;i++)
			name += process.argv[i] + " "
	}

	return name;
}

function setArtistName (data) {
	//Sets path to artist information
	var artists = data.tracks.items[0].album.artists;
	//Sets name of first artist listed
	var string = artists[0].name
	
	//Creates a list of artists, if multiple
	if(artists.length > 1){
		for(var i=1; i<artists.length; i++)
			string += `, ${artists[i].name}`;
	}
	
	return string;
}

function displaySpotifyData (data,artists) {
	var dataPath = data.tracks.items[0]
	console.log(`Song: ${dataPath.name}`)
	console.log(`Artist: ${artists}`)
	console.log(`Album: ${dataPath.album.name}`)
	console.log(`Preview: ${dataPath.preview_url}`)
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

function spotify (){
	var Spotify = require('node-spotify-api');
	var client = new Spotify(keys.spotifyKeys);
	//Validation of entered song name. Allows multiple words
	//To do - bugfix involving special characters - specifically '
	var songName = setSongName()

	client.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}
		//Sets artist name. Allows for multiple artists
		var artists = setArtistName(data);
		//Displays song information to the console
		displaySpotifyData(data,artists);
 	})
};

