const User = require('../models/users');

exports.getPlayList = (req, res, next) => {
    const user = req.body;
    res.status(200).json(User.fetchPlayList(user.uname));
}

exports.login = (req, res, next) => {
    //console.log(User);
    res.status(200).json(User.login(req.body.username, req.body.password));
}

exports.addToPlayList = (req, res, next) => {
   // console.log(req.params.uname+"-"+req.params.songID);
    res.status(200).json(User.addToPlayList(req.params.uname, req.params.songID));
}

exports.removeFromPlayList = (req, res, next) => {
    res.status(200).json(User.removeFromPlayList(req.params.uname, req.params.songID));
}
