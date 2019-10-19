const https = require("https");
const { consumerKey, consumerSecret } = require("./secrets");

exports.getToken = callback => {
    const req = https.request(
        {
            method: "POST",
            host: "api.twitter.com",
            path: "/oauth2/token",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8",
                Authorization:
                    `Basic ` +
                    Buffer.from(consumerKey + ":" + consumerSecret).toString(
                        "base64"
                    )
                // Authorization: `Basic ${Buffer.from(
                //     `${consumerKey}:${consumerSecret}`
                // ).toString("base64")}`
            }
        },
        resp => {
            if (resp.statusCode != 200) {
                callback(resp.statusCode);
            } else {
                let body = "";
                resp.on("data", chunk => {
                    body += chunk;
                }).on("end", () => {
                    try {
                        callback(null, JSON.parse(body).access_token);
                    } catch (err) {
                        callback(err);
                    }
                });
            }
            // console.log(resp.statusCode);
        }
    );
    req.on("error", err => console.log(err));
    req.end(`grant_type=client_credentials`);
};

exports.getToken(function(err, token) {
    console.log(token);
});

exports.getTweets = (token, handle, callback) => {
    const authorization = "Bearer " + token;
    const req = https.request(
        {
            method: "GET",
            host: "api.twitter.com",
            path:
                "/1.1/statuses/user_timeline.json?screen_name=" +
                handle +
                "&tweet_mode=extended",
            headers: {
                Authorization: authorization
            }
        },
        resp => {
            if (resp.statusCode != 200) {
                callback(resp.statusCode);
            } else {
                let body = "";
                resp.on("data", chunk => {
                    body += chunk;
                }).on("end", () => {
                    try {
                        let parsedBody = JSON.parse(body);
                        const newArr = parsedBody
                            .map(elem => {
                                if (elem.entities.urls.length === 1) {
                                    return {
                                        text:
                                            elem.full_text.slice(
                                                0,
                                                elem.full_text.indexOf("http")
                                            ) + `(${elem.user.name})`,
                                        href: elem.entities.urls[0].url
                                    };
                                }
                            })
                            .filter(items => items != null);
                        // console.log(newArr);
                        callback(null, newArr);
                    } catch (err) {
                        callback(err);
                    }
                });
            }
        }
    );
    req.on("error", err => console.log(err));
    req.end(`grant_type=client_credentials`);
};
