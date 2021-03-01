const router = require('express').Router();
const verify = require('./verifyToken');


// use verify as middle ware
router.get('/', verify, (req, res) => {
    res.json({you_are: req.user.email})
});


module.exports = router