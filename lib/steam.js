const readline = require('readline');

const SteamUser = require('steam-user');
let client = new SteamUser();

let Lib = {};


client.on('steamGuard', function (domain, callback) {
    console.log("Steam Guard code needed from email ending in " + domain);
});

client.on('loggedOn', function (details) {
    console.log("Logged into Steam as " + client.steamID.getSteam3RenderedID());
});

client.on('error', function (e) {
    console.error("Failed to login to steam. Double check your username and password. If you were prompted to enter a steamguard code, please verify it is correct.");
    console.log(e);
    process.exit(-2);
});

client.on('friendsList', function (friends) {
    console.log(client.myFriends);
    // client.addFriend(steamID, callback);
});

Lib.login = (username, password, authcode) => {
    let logonOptions = {
        "accountName": username,
        "password": password,
        "machineName": "autofriend",
        "dontRememberMachine": false,
        "rememberPassword": true
    };

    // If we set the authcode option
    if(!!authcode) {
        logonOptions['authCode'] = authcode;
    }

    client.logOn();
};

init();

module.exports = Lib;
