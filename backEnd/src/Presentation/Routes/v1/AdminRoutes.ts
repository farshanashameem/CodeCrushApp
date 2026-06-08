import { adminLoginController, userManagementController, childManagementController } from '@/Presentation/Factory/AdminFactory';
import { tokenService } from '@/Presentation/Factory/ParentFactory';
import { authHandler } from '@/Presentation/Middlewares/AuthMiddleware';
import { ROUTES } from '@/Shared/Routes';
import  Express  from 'express';

const router = Express.Router();

router.post(ROUTES.ADMIN.LOGIN, adminLoginController.login );

router.use(  authHandler(tokenService) );
router.get( ROUTES.ADMIN.USER_MANAGEMENT.USERS.BASE, userManagementController.getAllUsers);
router.get(`${ROUTES.ADMIN.USER_MANAGEMENT.USERS.BASE}${ROUTES.ADMIN.USER_MANAGEMENT.USERS.BY_ID}`,
  userManagementController.getUserDetails
);
router.patch(`${ROUTES.ADMIN.USER_MANAGEMENT.USERS.BASE}${ROUTES.ADMIN.USER_MANAGEMENT.USERS.STATUS}`, userManagementController.toggleUserStatus );
router.patch(ROUTES.ADMIN.CHILD_MANAGEMENT.CHILDREN.STATUS, childManagementController.toggleStatus);

router.get(ROUTES.ADMIN.CHILD_MANAGEMENT.CHILDREN.BY_ID, childManagementController.childDetails);
export default router;