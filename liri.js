var keys = require("./keys.js");
var fs = require("fs")
var command = process.argv[2];

function twitter () {
	log("============ RUNNING my-tweets ============")

	//Calls Twitter node package
	var Twitter = require('twitter');
	//Passes twitterKeys into the Twitter NPM (?)
	var client = new Twitter(keys.twitterKeys)	
	//Creates object is parameters used for the twitter search
	var params = {
		screen_name: 'NUCBimrankazmi', 
		limit: 3
	};

	client.get('statuses/user_timeline', params, function(err, tweets, response) {
		if (!err) {
			tweets.forEach(function(i){
				log(`${i.text}. Created at: ${i.created_at} by user ${i.user.screen_name}`);
			})
		}
	})
}

function spotify () {
	log("============ RUNNING spotify-this-song ============")
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
	log(`Song: ${dataPath.name}`)
	log(`Artist: ${artists}`)
	log(`Album: ${dataPath.album.name}`)
	log(`Preview: ${dataPath.preview_url}`)
}

function omdb () {
	log("============ RUNNING movie-this ============")

	var request = require("request")

	var movieName = setMovieName();

	var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";

	console.log(queryURL);

	request(queryURL, function(err,response,body){
		if (!err && response.statusCode === 200) {
			displayMovieData(body)
		}
	})
}

function setMovieName () {
	var name = ""

	//Sets movie if no value is entered
	if(process.argv[3] === undefined){
		name = "Mr. Nobody";
	}else{
		//Appends words of the song together into one string
		for(var i=3; i<process.argv.length;i++)
			name += process.argv[i] + " "
	}

	return name;
}

function displayMovieData (body) {
	var pBody = JSON.parse(body)

	log(`Title: ${pBody.Title}`)
	log(`Year: ${pBody.Year}`)
	log(`IMDB Rating: ${pBody.imdbRating}`)
	log(`RT Rating: ${pBody.Ratings[1].Value}`)
	log(`Country: ${pBody.Country}`)
	log(`Language: ${pBody.Language}`)
	log(`Plot: ${pBody.Plot}`)
	log(`Actors: ${pBody.Actors}`)
}

function doIt () {
	fs.readFile("random.txt","utf8",function(err,data){
		if(err){
			return console.log(err)
		}

		var dataArr = data.split(",");
		command = dataArr[0]
		process.argv[3] = dataArr[1]

		runCommand(command);
	})
}

function runCommand (cmd) {

	switch(cmd){
		case "my-tweets":
			twitter();
			break;

		case "spotify-this-song":
			spotify();
			break;

		case "movie-this":
			omdb();
			break;

		case "do-what-it-says":
			doIt();
			break;

		default:
			console.log("Enter a proper command")
	}
}

function log(message) {
	console.log(message)

	fs.appendFile("log.txt", message+"\n", function (err){
		if(err) return console.log(err)
	})	
}

runCommand(command);

