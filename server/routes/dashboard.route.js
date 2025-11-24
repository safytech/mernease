import express from 'express';
import {
  getData
} from '../controllers/dashboard.controller.js'; 
import verifyToken from '../utils/verifyUser.js'; 
 

const router = express.Router();
router.get('/getdata',verifyToken, getData);

export default router; 