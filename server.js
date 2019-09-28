require('dotenv').config()
const fs = require('fs');
const twitter = require('twitter');

//Check if dev mode for
let mode = process.env.mode;
if (mode === 'dev') {
  let dir = './logs'
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  };
};

let client = new twitter({
  consumer_key: process.env.key,
  consumer_secret: process.env.secret,
  access_token_key: process.env.token_key,
  access_token_secret: process.env.token_secret
});
let follow = {
  follow: `765582935831576576,146436211,22536055,7212562,5920532,34176543,14372091,388926026`
};

console.log('Starting Twitter follow stream');
client.stream('statuses/filter', follow, function (stream) {
  stream.on('data', function (tweet) {
    //Check to see if this is the user replying to another user, or if it is a retweet. 
    if (tweet.in_reply_to_user_id === null && tweet.in_reply_to_status_id === null && !(tweet.retweeted_status)) {
      if (mode === 'dev') { fs.appendFileSync(`./logs/${tweet.id}.json`, JSON.stringify(tweet))};
      console.log(`I just got a tweet from ${tweet.user.name} - ${tweet.id}`);
      console.log(`Try to retweet ${tweet.id}`);
      client.post('statuses/retweet/' + tweet.id_str, function (error, reTweet, callback) {
        if (error) { console.log(`Error in client.post: ${{error}}`); return;};
        console.log('!! -- I just re-tweeded ' + tweet.user.name);
      });
    };
  });
  stream.on('error', function (error) {
    console.log('Stream.on says --You done got an error! ' + error);
  });
});