const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();


router.get('/:uname', userController.getPlayList);
/*
router.put('/:uname/:songID', (req, res, next)=>{
    console.log(req.params);
    next();
});
*/
router.put('/:uname/:songID', userController.addToPlayList);

router.delete('/:uname/:songID', userController.removeFromPlayList);

router.post('/', userController.login);//login without page

module.exports = router;