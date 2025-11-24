import express from 'express';
import {
   signin, signup, forgot, reset
  } from '../controllers/auth.controller.js';  
const router = express.Router();

router.post('/signup',signup);
router.post('/signin',signin);
router.post('/forgot',forgot);
router.post('/reset/:token',reset);
//test
export default router; 