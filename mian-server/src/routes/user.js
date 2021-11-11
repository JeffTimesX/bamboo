const express = require('express');
const router = express.Router();

const user = require('../controllers/user.js');

router.get('/watches/:sub', user.getWatches);
router.post('/watches/:sub', user.updateWatches);


router.get('/user/:sub', user.getUserBySub) 
router.post('/user/:sub', user.updateUserBySub)
router.delete('/user/:id', user.deleteUserById)



router.get('/posts/:userId', user.getPosts)

// router.post('/posts/:sub', user.addToPosts)
// router.put('/posts/:sub', user.updateToPosts)
// router.delete('/posts/:sub', user.deleteFromPosts)

// router.get('/follows/:sub', user.getFollows);
// router.post('/follows/:sub', user.addToFollows)
// router.put('/follows/:sub', user.updateToFollows)
// router.delete('/follows/:sub', user.deleteFromFollows)

module.exports = router;
