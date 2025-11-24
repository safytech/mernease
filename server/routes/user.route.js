import express from 'express';
import {
  deleteUser,
  getUser,
  getUsers,
  signout,
  updateUser,
  addUser,
  getUsersConfig,
} from '../controllers/user.controller.js';
import verifyToken from '../utils/verifyUser.js';

const router = express.Router();

router.post('/adduser', verifyToken, addUser);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);
router.get('/getusers', verifyToken, getUsers);
router.get('/getUsersConfig', verifyToken, getUsersConfig);
router.get('/getUser/:userId', getUser);

export default router;
