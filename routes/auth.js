const express = require('express');
const axios = require('axios');
const cron = require('node-cron');

const router = express.Router();

const clientId = "ate5fi3vinjjn6msz3tp9gc8xf40ss";
const clientSecret = "qv5pydieropeasma9yfvqicoac830s";
const redirectUrl = "http://localhost:3000/auth/twitch/callback";
const title  = "MegaDonger";

let clients = [];

// Every minute, check to see if we need to refresh the twitch session
cron.schedule('* * * * *', () => {
    // Refresh loop for access tokens
    for(let i = 0; i < clients.length; i ++) {
        const refreshUrl = "https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token="
            + clients[i].refreshToken + "&client_id=" + clientId + "&client_secret=" + clientSecret;
        // Update the refreshtokens that need it
        clients[i].expiresIn = clients[i].expiresIn - 60;
        if(clients[i].expiresIn < 130) {
            axios.post(refreshUrl, {}).then((response) => {
                clients[i].refreshToken = response.data.refresh_token;
                clients[i].accessToken = response.data.access_token;
                clients[i].expiresIn = response.data.expires_in;
                console.info("Refreshed accessToken: " + clients[i].accessToken + ", " + clients[i].expiresIn + ", " + clients[i].refreshToken);
            }).catch((err) => {
                console.error(err);
            });
        }
    }
});

cron.schedule('* * * * * *', () => {
    let subscriptions = [];
    for(let i = 0; i < clients.length; i ++) {
        let current = -1;
        let total = 0;
        while(current < total) {
            if(current === -1) current = 0;
            const subscriptionUrl = "https://api.twitch.tv/kraken/channels/" + clients[i].userId + "/subscriptions"
                + "?limit=100&offset=" + current + "&direction=desc";
            axios.get(subscriptionUrl, {
                headers: {
                    'Authorization': 'OAuth ' + clients[i].accessToken,
                    'Accept': 'application/vnd.twitchtv.v5+json'
                }
            }).then((response) => {
                // TODO: Needs to be tested with someone that has a subscription program
                total = response.data._total;
                if(total > current + 100) current += 100;
                // Add the subscription to the subscriptions list
                response.data.subscriptions.forEach((subscription) => {
                    subscriptions.push(subscription);
                });
            }).catch((err) => {
                console.error(err);
            });
        }
    }
});


// Logs into twitch and saves the oauth information
router.get('/twitch/callback', function(req, res, next) {
    const code = req.query.code;
    const twitchUrl = "https://id.twitch.tv/oauth2/token?client_id=" + clientId + "&client_secret=" + clientSecret +
        "&code=" + code + "&grant_type=authorization_code&redirect_uri=" + redirectUrl;
    axios.post(twitchUrl, {}).then((response) => {
        const accessToken = response.data.access_token;
        const expiresIn = response.data.expires_in;
        const refreshToken = response.data.refresh_token;
        // Get the userId
        axios.get('https://api.twitch.tv/kraken', {
            headers: {
                'Authorization': 'OAuth ' + accessToken,
                'Accept': 'application/vnd.twitchtv.v5+json'
            }
        }).then((r) => {
            console.log(accessToken + ", " + expiresIn + ", " + refreshToken);
            const client = {
                'accessToken': accessToken,
                'expiresIn': expiresIn,
                'refreshToken': refreshToken,
                'username': r.data.token.user_name,
                'userId': r.data.token.user_id
            };
            clients.push(client);
            res.render('admin', { title: title });
        });
    }).catch((err) => {
        console.log("Failed to log in with twitch");
        res.render('index', { title: title });
    });
});

module.exports = router;
