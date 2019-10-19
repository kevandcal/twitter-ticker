const express = require("express");
const app = express();
const twitter = require("./twitter");
const util = require("util");
const getToken = util.promisify(twitter.getToken);
const getTweets = util.promisify(twitter.getTweets);

app.use(express.static("./public"));

app.get("/data.json", (req, res) => {
    getToken().then(token => {
        return Promise.all([
            getTweets(token, "bbcworld"),
            getTweets(token, "sciam"),
            getTweets(token, "forbes")
        ])
            .then(results => {
                // console.log(results);

                let bbcworld = results[0];
                let sciam = results[1];
                let forbes = results[2];

                // concat
                // let mergedResults = bbcworld.concat(sciam, forbes);

                //spread operator
                let mergedResults = [...bbcworld, ...sciam, ...forbes];

                let sorted = mergedResults.sort((a, b) => {
                    return new Date(b.created_at) - new Date(a.created_at);
                });
                res.json(sorted);
            })
            .catch(err => {
                console.log(err);
                res.sendStatus(500);
            });
    });
});

app.listen(8080, () => console.log("I'm listening."));
