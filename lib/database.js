const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('megas.db');


let Lib = (() => {
    let ret = {};

    function init() {
        db.run("CREATE TABLE if not exists admiral_mega_subs (id integer PRIMARY KEY, twitch_name TEXT NOT NULL, twitch_id TEXT NOT NULL, steam_id TEXT NOT NULL, is_mega BOOL);");
    }

    ret.addUser = (twitchName, twitchId, steamId, isMega) => {
        let params = [twitchName, twitchId, steamId, isMega];
        db.run("INSERT INTO admiral_mega_subs (twitch_name, twitch_id, steam_id, is_mega) VALUES (?, ?, ?, ?);", params, (err, row) => {
            if(err) {
                console.error("Error inserting into DB: " + err);
            } else {
                console.info(row.info);
            }
        });
    };

    ret.updateUser = () => {

    };

    init();

    return ret;
})();


module.exports = Lib;