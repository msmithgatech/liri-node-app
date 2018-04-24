//  ENVIRONMENTALS

require("dotenv").config();

//  NECESSARYs

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require("request");
var fs = require("fs");

//  VARIABLES to obtain Keys file, then separately define the TWITTER and SPOTIFY keys
var keys = require("./keys.js");
var client = new Twitter(keys.twitter);
var spotify = new Spotify(keys.spotify);

// VARIABLES for COMMAND LINE ARGUMENTS and LOG ACTIVITY
var inSubject = (process.argv[2]);
var inSrch = (process.argv[3]);
var parsdVals = {
    songName: "",
    movName: ""
};
var allLogMsgs = [];


switch (inSubject) {
    case "my-tweets":
        callTweets();
        break;

    case "spotify-this-song":
        carryValue(inSrch);
        callMusic();
        break;

    case "movie-this":
        carryValue();
        callFlick();
        break;

    case "do-what-it-says":
        callRandm();
        break;

    default:
        console.log("Please enter a subject and a value");
}

//   BEGIN FUNCTIONS
function callTweets() {
    var params = {screen_name: 'MsTBoot', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets) {
        if (error) {
            var errTweet = ("\nTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT" +
                "\nTTTTTTTTTT   E R R O R  TWEET REQUEST: unable to find Tweets for User" +
                "\nTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
            allLogMsgs += errTweet + ",";
            fs.appendFile("log.txt", errTweet, function(err) {
                if (err) {
                    return console.log("Unsuccessful write to Log file for errTWEET.");
                }
                console.log("\n===============================================");
            });
            return console.log(errTweet);
        }
        var tCount = 0;
        for (var i = 0; i < tweets.length; i++) {
            tCount ++;
            var logTweet = ("\n+++++++++++++++++++++++++++++++++++++++++" +
                 "\n++++++++++++  TWEET NUMBER " + tCount + "++++++++++" +
                 "\n+++++++++++++++++++++++++++++++++++++++");
            var infoTweet =
                 "\nTweet: " + tweets[i].text +
                 "\nCreated: " + tweets[i].created_at;
            allLogMsgs += logTweet + "," + infoTweet + ",";
            combTweets = logTweet + infoTweet;
            fs.appendFile("log.txt", combTweets, function(err) {
                if (err) {
                    return console.log("Unsuccessful write from TWITTER INFO.");
                }
            });
            console.log(logTweet + infoTweet);
        }
    });
}

function carryValue(inSrch) {

             //  SET ALUES FOR songName AND movName OTHERWISE, they are blank
    if (inSrch !=== undefined) {
        if (inSubject === "spotify-this-song")
            parsdVals.songName = inSrch.replace(" ", "%20");
        if (inSubject === "movie-this")
            parsdVals.movName = inSrch.replace(" ", "+");
    } else {
      if (inSubject === "spotify-this-song")
          parsdVals.songName = "The%20Sign%20Ace%20of%20Base";
      if (inSubject === "movie-this")
          parsdVals.movName = "Mr.+Nobody";
    }
    return (parsdVals);
}

function callMusic(parsdVals) {
    //  RESULTS OF SPOTIFY SEARCH WILL BE
    //     Artist(s)   Song Name   Preview Link   Album

    spotify.search({type: 'track', query: parsdVals.songName}, function(err, data) {
        if (error) {
            var errSpot = ("\nSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS" +
                "\nSSSSSSSSSS   E R R O R  SPOTIFY: unable to find track " + parsdVals.songName +
                "\nSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS");
            allLogMsgs += errSpot;
            fs.appendFile("log.txt", errSpot, function(err) {
                if (err) {
                    return console.log("Unsuccessful write to Log File from errSpot.");
                }
                console.log("\n===============================================");
            });
            return console.log(errSpot + " " + error);
        }
        if (parsdVals.songName = "The+Sign") {
            var deflt = ("\nSFSFSFSFSFSFSFSFSFSFSFSFSFSFSFSFSFSFSFSF" +
                "\nSFSFSFSFSF   REQUESTED SPOTIFY TRACK NOT FOUND." +
                "\nSFSFSFSFSF   THE SIGN BY ACE OF BASE WILL BE LOGGED." +
                "\nFSFSFSFSFSFSFSFSFSFSFSFSFSFSFSFSFSFSFSF");
            allLogMsgs += deflt + "\n" + data.track.items;
            fs.appendFile("log.txt", deflt, function(err) {
                if (err) {
                    return console.log("Unsuccessful write from DEFAULT Spotify Song.");
                }
                console.log("\n===============================================");
            });
            console.log(deflt + "\n " + data.track.items);
        } else {
            var listSong = data.track.items;
            var logSPOT = ("\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&" +
                "\n&&&&&&&&&&   SPOTIFY  Song Info for: " + parsdVals.songName +
                "\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
            infoSong = (
                "\nArtist: " + listSong.info[0].artists[0].name +
                "\nSong Title: " + listSong.info[0].name +
                "\nAlbum: " + listSong.info[0].album.name +
                "\nPreview Link: " + listSong.info[0].preview_url);
            var combSPOTs = logSPOT + infoSong;
            allLogMsgs += logSPOT + "," + infoSong + ",";
            fs.appendFile("log.txt", combSPOTs, function(err) {
                if (err) {
                    return console.log("Unsuccessful write to Log file from Spotify Song.");
                }
                console.log("\n===============================================");
            });
            console.log(logSPOT + infoSong);
        }
    });
}

function callFlick() {
    // OMDB MOVIE API SEARCH, DISPLAY:
    //   Movie Title            Year of Release
    //   IMDB Rating            Rotten Tomatoes Rating
    //   Produced in (Country)  Language of the movie
    //   Movie Plot             Actors

    queryUrl = "http://www.omdbapi.com/";
    request(queryUrl + "?t=" + parsdVals.movName + "&y=&plot=short&apikey=trilogy",
        function(error, response, body) {
            if (err) {
                var errOMDB = ("\nOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO" +
                    "\nOOOOOOOOOO   E R R O R   OMDB REQUEST: unable to find " + parsdVals.movName +
                    "\nOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
                allLogMsgs += errOMDB;
                fs.appendFile("log.txt", errOMDB, function(err) {
                    if (err) {
                        return console.log("Unsuccessful write to Log File from errOMDB.");
                    }
                    console.log("\n===============================================");
                });
                return console.log(errOMDB);
            }
            if (response.StatusCode === 200) {
                // DISPLAY MOVIE CONTENT WITH OR WITHOUT ROTTEN TOMATOES RATING
                var logOMDB = ("\nYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY" +
                    "\nYYYYYYYYYY   MOVIE Info for: " + parsdVals.movName +
                    "\nYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY");

                var movData = JSON.parse(body);
                var rtMsg = "";
                if (movData.Ratings.length < 2) {
                    rtMsg = "ROTTEN TOMATOES rating unavailable";
                }
                if (movData.Rating[1].Value !== undefined) {
                    rtMsg = movData.Ratings[1].Value;
                }
                var infoMovie = (
                    "\nTitle: " + movData.Title +
                    "\nReleased: " + movData.Released +
                    "\nIMDB Rating: " + movData.imdbRating +
                    "\nRotten tomatoes Rating: " + rtMsg +
                    "\nProducing Country: " + movData.Country +
                    "\nLanguage: " + movData.Language +
                    "\nPlot: " + movData.Plot +
                    "\nActors: " + movData.Actors);
                var combMovie = logOMDB + infoMovie;
                allLogMsgs += logOMDB + "," + infoMovie + ",";
                fs.appendFile("log.txt", combMovie, function(err) {
                    if (err) {
                        return console.log("Unsuccessful write to Log File from combMovie.");
                    }
                    console.log("\n===============================================");
                });
                console.log(logOMDB + infoMovie);
            } else {
                var errStat200 = ("\n200200200200200200200200200200200200200" +
                    "\n200200200200  S T A T U S   OMDB REQUEST STATUS ERROR" + reposnse.statusCode +
                    "\n200200200200200200200200200200200200200");
                allLogMsgs += errStat200 + ",";
                fs.appendFile("log.txt", errStat200, function(err) {
                    if (err) {
                        return console.log("Unsuccessful write to Log File from errStat200.");
                    }
                    console.log("\n===============================================");
                });
                console.log(errStat200);
            }
        });     //  END FUNCTION ERROR BODY
}   //  END CALLFLICK

function callRandm() {
    fs.readFile("random.txt", "utf8", function(err, data) {
                // IF ERROR READING RANDOM FILE, LOG IT AND RETURN IMMEDIATELY
        if (err) {
            var errRandom = ("\nRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR" +
                "\nRRRRRRR   E R R O R  RANDOM: Unable to read contents of random.txt" +
                "\nRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR");
            allLogMsgs += errRandom + ",";
            fs.appendFile("log.txt", errRandom, function(err) {
                if (err) {
                    return console.log("Unsuccessful write from errRandom.");
                }
                console.log("\n===============================================");
            });
            return console.log(errRandom);
        }
              //  RANDOM FILE READ SUCCESSFULLY
              //  SPLIT DATA INTO 2 PARTS BASED ON LOCATION OF SEMI-COLON
              //  RELPLACE SPACES WITH %20 FOR SPOTIFY SEARCH

        var randmArr = data.split(";");
        var rSubject = randmArr[0];
        var rAction = randmArr[1];
        rAction.replace(" " , "%20");
        console.log(rSubject + " " + rAction);

        var logRandm = ("\nWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW" +
            "\nWWWWWWW   RANDOM: Successful read of random file"  + rSubject + " " + rAction +
            "\nWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW");
        allLogMsgs += logRandm + "," ;
        fs.appendFile("log.txt", logRandm, function(err) {
            if (err) {
                return console.log("Unsuccessful write to Log File from logRandm.");
            }
            console.log("\n===============================================");
        });

        callMusic();

    })  // END READFILE
}  //  END CALLRANDM