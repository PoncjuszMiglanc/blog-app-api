const express = require('express');

const userControllers = require('../controllers/user');

const router = express.Router();

router.post('/register', userControllers.register);
router.post('/login', userControllers.login);
router.post('/logout', userControllers.logout);
router.get('/user/:id', userControllers.getUserData);
router.put('/user/update/:id', userControllers.updateUserData);
router.post('/user/delete/:id', userControllers.deleteUserData);

module.exports = router;
