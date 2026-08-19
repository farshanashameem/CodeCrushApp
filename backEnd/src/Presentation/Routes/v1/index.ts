import { Router } from 'express';
import authRoutes from './authRoutes';
import adminRoutes from './AdminRoutes';
import parentRoutes from './ParentRoutes';
import childRoutes from './ChildRoutes';
import aiGameRoutes from './AIGameRoutes';
const router = Router();

router.use('/auth', authRoutes);
router.use('/auth/admin', adminRoutes);
router.use('/auth/parent', parentRoutes);
router.use('/auth/child', childRoutes);
router.use('/auth/ai-game/', aiGameRoutes);

export default router;