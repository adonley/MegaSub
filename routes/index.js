let express = require('express');
let consts = require('../lib/consts');
let router = express.Router();
let sql = require('../lib/database');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: consts.title });
});

router.post('/', (req, res, next) => {
    const twitchNane = req.body.twitchName;
    const steam64 = req.body.steam64;
    // TODO: Validate these.
    
    res.render('registered', { title: consts.title });
});

module.exports = router;