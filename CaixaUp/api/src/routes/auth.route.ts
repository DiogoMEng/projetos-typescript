import { Router } from 'express';
const AuthController = require('../controllers/auth.controller');

const router = Router();

router
  .post('/login', AuthController.login);

export default router;