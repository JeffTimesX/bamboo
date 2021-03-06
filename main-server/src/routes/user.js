const express = require('express');
const router = express.Router();

const { checkJwt, lookJwt } = require('../auth/check-jwt')
const { hasPermission } = require('../auth/has-permission')
const { hasScope } = require('../auth/has-scope')

const user = require('../controllers/user.js');

router.get('/watches/:sub', checkJwt, hasPermission('read:user'), user.getWatches);
router.post('/watches/:sub', checkJwt, hasPermission('write:user'), user.updateWatches);


router.get('/user/:sub', checkJwt, hasPermission('read:user'), user.getUserBySub) 
router.post('/user/:sub',  checkJwt, hasPermission('write:user'), user.updateUserBySub)
router.delete('/user/:id',  checkJwt, hasPermission('manage:user'), user.deleteUserById)


router.get('/posts/:userId', user.getPosts)


// router.post('/posts/:sub', user.addToPosts)
// router.put('/posts/:sub', user.updateToPosts)
// router.delete('/posts/:sub', user.deleteFromPosts)

// router.get('/follows/:sub', user.getFollows);
// router.post('/follows/:sub', user.addToFollows)
// router.put('/follows/:sub', user.updateToFollows)
// router.delete('/follows/:sub', user.deleteFromFollows)

module.exports = router;
