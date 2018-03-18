const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const consts = require('../lib/consts');

const router = express.Router();

let clients = [];

// Every minute, check to see if we need to refresh the twitch session
cron.schedule('* * * * *', () => {
    // Refresh loop for access tokens
    for(let i = 0; i < clients.length; i ++) {
        const refreshUrl = "https://id.twitch.tv/oauth2/token?grant_type=refresh_token&refresh_token="
            + clients[i].refreshToken + "&client_id=" + consts.clientId + "&client_secret=" + consts.clientSecret;
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

function getSubscribers() {
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
                // TODO: Check headers for throttling from twitch
                total = response.data._total;
                if(total > current + 100) current += 100;
                // Add the subscription to the subscriptions list
                response.data.subscriptions.forEach((subscription) => {
                    subscriptions.push(subscription);
                });
            }).catch((err) => {
                console.log("Failed to get subscribers for user: " + clients[i].username + ", maybe this user doesn't have a sub button?");
                console.log("Removing from twitch list");
                clients.splice(i, 1);
            });
        }
    }
}

cron.schedule('* * * * * *', () => {
    getSubscribers();
});


// Logs into twitch and saves the oauth information
router.get('/twitch/callback', function(req, res, next) {
    const code = req.query.code;
    const twitchUrl = "https://id.twitch.tv/oauth2/token?client_id=" + consts.clientId + "&client_secret=" + consts.clientSecret +
        "&code=" + code + "&grant_type=authorization_code&redirect_uri=" + consts.redirectUrl;
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

            // Get the subscribers
            getSubscribers();

            // Push it to the client list to scan every few mins
            clients.push(client);

            res.render('admin', { title: consts.title });
        });
    }).catch((err) => {
        console.log("Failed to log in with twitch");
        res.render('index', { title: consts.title, serverUrl: consts.serverUrl, clientId: consts.clientId });
    });
});

module.exports = router;
