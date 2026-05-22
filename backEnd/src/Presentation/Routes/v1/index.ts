import { Router } from "express";
import authRoutes from './authRoutes';
import adminRoutes from './AdminRoutes';
import parentRoutes from './ParentRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/auth/admin', adminRoutes);
router.use('/auth/parent', parentRoutes);

export default router;