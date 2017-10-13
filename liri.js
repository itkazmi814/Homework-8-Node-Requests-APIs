var keys = require("./keys.js");
var command = process.argv[2];

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

	console.log(`Title: ${pBody.Title}`)
	console.log(`Year: ${pBody.Year}`)
	console.log(`IMDB Rating: ${pBody.imdbRating}`)
	console.log(`RT Rating: ${pBody.Ratings[1].Value}`)
	console.log(`Country: ${pBody.Country}`)
	console.log(`Language: ${pBody.Language}`)
	console.log(`Plot: ${pBody.Plot}`)
	console.log(`Actors: ${pBody.Actors}`)
}

function twitter () {
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
				console.log(`${i.text}. Created at: ${i.created_at} by user ${i.user.screen_name}`);
			})
		}
	})
}

function spotify () {
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

function omdb () {
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

function doIt () {
	var fs = require("fs")
	fs.readFile("random.txt","utf8",function(err,data){
		if(err){
			return console.log(err)
		}

		var dataArr = data.split(",");
		command = dataArr
		process.argv[3] = dataArr[2]

		runCommand(command);

	})

	//Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
	//It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
	//Feel free to change the text in that document to test out the feature for other commands.
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

runCommand();