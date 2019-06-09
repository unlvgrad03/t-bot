require('dotenv').config()
const fs = require('fs');
const twitter = require('twitter');
const mongoose = require('mongoose');


let dbUser = process.env.DB_USER;
let dbPassword = process.env.DB_PASSWORD
//mongoose.connect(`mongodb+srv://<username>:<password>@cluster0-qircp.gcp.mongodb.net/test?retryWrites=true`)

let client = new twitter({
  consumer_key: process.env.key,
  consumer_secret: process.env.secret,
  access_token_key: process.env.token_key,
  access_token_secret: process.env.token_secret
});
let follow = {
  follow: `765582935831576576,146436211, 22536055, 7212562,5920532`} 
//Agiligator, Agilysys, American, Southwest, Delta
console.log('!! -- Starting Twitter follow stream');
client.stream('statuses/filter',
  follow,
  function (stream) {
    stream.on('data', function (tweet) {
      console.log('I just got a tweet from: ' + tweet.user.name);
      if (tweet.in_reply_to_user_id === null) {
        console.log(`Retweet - reply to null ${tweet.id}`);
        //fs.appendFileSync(`./${tweet.id}.json`, JSON.stringify(tweet))
        client.post('statuses/retweet/' + tweet.id_str, function (error, reTweet, callback) {
          if (error) {
            console.warn('client.post says -error! ', error);
            return;
          };
          console.log('!! -- I just re-tweeded ' + tweet.user.name);
        });
      };
    });
    stream.on('error', function (error) {
      console.warn('Stream.on says --You done got an error! ' + error);
    });
  });