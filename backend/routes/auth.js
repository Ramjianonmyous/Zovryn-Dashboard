const r=require('express').Router(),{protect}=require('../middleware/auth'),{register,login,getMe,updateProfile,changePassword}=require('../controllers/authController');
r.post('/register',register);r.post('/login',login);r.get('/me',protect,getMe);r.put('/profile',protect,updateProfile);r.put('/password',protect,changePassword);
module.exports=r;