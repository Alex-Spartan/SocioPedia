import { Router } from 'express'
import {
    getUser,
    getFriends,
    addRemoveFriends,
} from '../controllers/users.js'

import { verifyToken } from '../middleware/auth.js';

const router = Router();    

router.get('/:id', verifyToken, getUser)
router.get('/:id/friends', verifyToken, getFriends)


router.patch('/:id/:friendId', verifyToken, addRemoveFriends)

export default router;