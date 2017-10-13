var keys = require("./keys.js");
var fs = require("fs")
var inquirer = require("inquirer")

function twitter () {
	log("============ RUNNING my-tweets ============")

	//Calls Twitter node package
	var Twitter = require('twitter');
	//Passes twitterKeys into the Twitter NPM (?)
	var client = new Twitter(keys.twitterKeys)	
	//Creates object is parameters used for the twitter search

	inquirer.prompt([{
		type: "input",
		name: "userName",
		message: "What user would you like to search for?"
	}]).then(function (answers){
		var params = {
			screen_name: answers.userName, 
			limit: 3
		};

		log(`Search: ${answers.userName}`)

		client.get('statuses/user_timeline', params, function(err, tweets, response) {
			if (!err) {
				tweets.forEach(displayTweets)

			}
		})		
	})
}

function displayTweets (i){
	console.log("----------------------")
	console.log(`TWEET: ${i.text}`)
	console.log(`Created at: ${i.created_at}`)
	console.log(`By user ${i.user.screen_name}`);
}

function spotify () {
	log("============ RUNNING spotify-this-song ============")
	inquirer.prompt([
		{
			type: "input",
			name: "songName",
			message: "What song would you like to search for?"
		}
	]).then(function(answers){

		log(answers.songName)

		var Spotify = require('node-spotify-api');
		var client = new Spotify(keys.spotifyKeys);
		//Validation of entered song name. Allows multiple words
		//To do - bugfix involving special characters - specifically '
		var songName = setSongName(answers)

		client.search({ type: 'track', query: songName, limit: 1 }, function(err, data) {
			if (err) {
				return console.log('Error occurred: ' + err);
			}
			//Sets artist name. Allows for multiple artists
			var artists = setArtistName(data);
			//Displays song information to the console
			displaySpotifyData(data,artists);
	 	})
	})

}

function setSongName (answers) {
	// var name = ""
	//Sets song if no value is entered
	console.log("entering setSongName")
	console.log(answers);
	if(answers.songName === ""){
		return "The Sign Ace of Base";
	}else{
	/*	//Appends words of the song together into one string
		for(var i=3; i<process.argv.length;i++)
			name += process.argv[i] + " "
	*/
		return answers.songName;
	}
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
	console.log("----------------------")
	console.log(`Song: ${dataPath.name}`)
	console.log(`Artist: ${artists}`)
	console.log(`Album: ${dataPath.album.name}`)
	console.log(`Preview: ${dataPath.preview_url}`)
}

function omdb () {
	log("============ RUNNING movie-this ============")

	inquirer.prompt([{
			type: "input",
			name: "movieName",
			message: "What movie do you want to search for?"
		}]).then(function (answers) {

			log(answers.movieName)

			var request = require("request")

			var movieName = setMovieName(answers);

			var queryURL = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
			console.log(queryURL);

			request(queryURL, function(err,response,body){
				if (!err && response.statusCode === 200) {
					displayMovieData(body)
				}
			})	
		})
}

function setMovieName (answers) {
	// var name = ""
	//Sets movie if no value is entered
	if(answers.movieName === ""){
		return "Mr. Nobody";
	}else{
		/*//Appends words of the song together into one string
		for(var i=3; i<process.argv.length;i++)
			name += process.argv[i] + " "
		*/
		return answers.movieName
	}
}

function displayMovieData (body) {
	var pBody = JSON.parse(body)
	console.log("----------------------")
	console.log(`Title: ${pBody.Title}`)
	console.log(`Year: ${pBody.Year}`)
	console.log(`IMDB Rating: ${pBody.imdbRating}`)
	console.log(`RT Rating: ${pBody.Ratings[1].Value}`)
	console.log(`Country: ${pBody.Country}`)
	console.log(`Language: ${pBody.Language}`)
	console.log(`Plot: ${pBody.Plot}`)
	console.log(`Actors: ${pBody.Actors}`)
}

function doIt () {
	fs.readFile("random.txt","utf8",function(err,data){
		if(err){
			return console.log(err)
		}

		var dataArr = data.split(",");
		var command = dataArr[0]
		// process.argv[3] = dataArr[1]

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

inquirer.prompt([
	{
		type: "list",
		name: "command",
		message: "What would you like to do?",
		choices: ["my-tweets","spotify-this-song","movie-this","do-what-it-says"]
	}
]).then(function(answers){
	runCommand(answers.command)
})



