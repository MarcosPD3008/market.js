import { Router } from 'express';
import { container, injectable } from "tsyringe";
import { UsersController } from '../controllers/users/users.controller';
import { auth } from '../utils/token.util';

const router = Router();
const users = container.resolve(UsersController);

//auth
router.post('/login', users.login);
router.get('/refresh', users.refresh);
router.post('/register', users.register);

router.post('/', auth, users.Post);
router.get('/', auth, users.Get);
router.get('/:id', auth, users.Find);
router.put('/:id', auth, users.Put);
router.delete('/:id', auth, users.Delete);

export default router;