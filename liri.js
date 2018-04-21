require("dotenv").config();
var fs = require("fs");
require("request");
require('node-spotify-api');
require('twitter');

var keys = require("./keys.js");
var rnDom = require("./random.txt");


var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

var inSubject = process.argv[2];
var inValue = process.argv[3];
var allLogMsgs = [];


// fs.appendFile("log.txt", failedKeys, function(err) {
//     if (err) {
//         return console.log("READ KEYS error was not appended to the log.txt file.");
//     };
// })
// }

function getTweets() {
    var params = {screen_name: 'MsGTBoot', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets) {
        if (error) {
            var errTweet = ("\nTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT" +
                "\nTTTTTTTTTT   E R R O R  TWEET REQUEST: unable to find Tweets for User" +
                "\nTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
            allLogMsgs.append(errTweet);
            return console.log(errTweet);
        }
        var tCount = 0;
        for (var i = 0; i < tweets.length; i++) {
            tCount ++;
            var logTweet = ("\n+++++++++++++++++++++++++++++++++++++++++" +
                 "\n++++++++++++  TWEET NUMBER " + tCount + "++++++++++" +
                 "\n+++++++++++++++++++++++++++++++++++++++");
            allLogMsgs.append(logTweet + "\n" + tweets[i]);
            console.log(logTweet + "\n" + tweets[i]);
        }
    });
}

function getSpotify(inValue) {
             //  SPOTIFY API SEARCH, DISPLAY:
             //     Artist(s)       Song Name
             //     Preview Link    Album

    var spotSong = JSON.stringify(inValue);
    spotify.search({type: 'track', query: spotSong}, function(err, data) {
        if (error) {
            var errSpot = ("\nSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS" +
                "\nSSSSSSSSSS   E R R O R  SPOTIFY REQUEST: unable to find track " + spotSong +
                "\nSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
            allLogMsgs.append(errSpot);
            return console.log(errSpot + " " + error);
        }
        var logSPOT = ("\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&" +
                 "\n&&&&&&&&&&   SPOTIFY Song Info for: " + spotSong +
                 "\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        allLogMsgs.append(logSPOT + "\n" + data);
        console.log(logSPOT + "\n " + data);
    });
}

function getMovie(inValue) {
    // OMDB MOVIE API SEARCH, DISPLAY:
    //   Movie Title            Year of Release
    //   IMDB Rating            Rotten Tomatoes Rating
    //   Produced in (Country)  Language of the movie
    //   Movie Plot             Actors

    var nameMovie = JSON.stringify(inValue);
    queryUrl = "http://www.omdbapi.com/";
    request(queryUrl + "?t=" + nameMovie + "&y=&plot=short&apikey=trilogy",
        function (error, body) {
            if (err) {
                var errOMDB = ("\nOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO" +
                    "\nOOOOOOOOOO   E R R O R  OMDB REQUEST: unable to find " + nameMovie +
                    "\nOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
                allLogMsgs.append(errOMDB);
                return console.log(errOMDB + "\n");
            }
                      // DISPLAY MOVIE CONTENT IN CONSOLE
            var logOMDB = ("\nYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY" +
                "\nYYYYYYYYYY   OMDB MOVIE Info for: " + nameMovie +
                "\nYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");
            var infoMovie = {
                title: JSON.parse(body).Title,
                released: JSON.parse(body).Released,
                rateIMDB: JSON.parse(body).imdbRating,
                // rateRotTom: JSON.parse(body).,
                prodCntry: JSON.parse(body).Country,
                lang: JSON.parse(body).Language,
                plot: JSON.parse(body).Plot,
                actors: JSON.parse(body).Actors
            };
            allLogMsgs.append(logOMDB + "\n" + infoMovie);
            console.log(body);
            console.log(logOMDB + "\n" + infoMovie);
        });     //  END REQUEST
}   //  END GETMOVIE

function getRandom(inValue) {
    fs.readFile(rnDom, "utf8", function (err, data) {
        // If there's an error retrieving keys, log it and return immediately
        if (err) {
            var errRandom = ("\nRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR" +
                "\nRRRRRRR   E R R O R  RANDOM: Unable to read contents of random.txt" +
                "\nRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
            allLogMsgs.append(errRandom);
            return console.log(errRandom + "\n");
        }
        //  RETRIEVE THE SPOTIFY AND TWITTER API KEYS
        //  SPLIT BY SEMI-COLON
        //  RE-DISPLAY DATA
        console.log("inside function getRandom, past the error");
        // console.log(data);
        var randmArr = data.split(";");
        console.log(randmArr);
        for (var i = 0; i < randmArr.length; i++) {
            console.log(randmArr[i]);
        }
    });  // END READFILE
}  //  END RANDOM


switch (inSubject) {
    case "my-tweets":
        getTweets();
        break;
//
//     case "spotify-this-song":
//         getSpotify(inValue);
//         break;
//
//     case "movie-this":
//         getMovie(inValue);
//         break;
//
//     case "do-what-it-says":
//         getRandom(inValue);
//         break;
    default:
        console.log("Please enter a subject and a value");
}
