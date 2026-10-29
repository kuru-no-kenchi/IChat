const express = require('express');
const router = express.Router();
const { updateProfile, getUserData, uploadPhoto, uploadSinglePhoto } = require('../controllers/profile');
const {authMiddleware} = require('../services/jwt');


router.get('/me', authMiddleware, getUserData);
router.patch('/me', authMiddleware, updateProfile);
router.post('/me/photo', authMiddleware, uploadSinglePhoto, uploadPhoto);



module.exports = router;