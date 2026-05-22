import { adminLoginController, userManagementController } from "@/Presentation/Factory/AdminFactory";
import { tokenService } from "@/Presentation/Factory/ParentFactory";
import { authHandler } from "@/Presentation/Middlewares/AuthMiddleware";
import { ROUTES } from "@/Shared/Routes";
import  Express  from "express";

const router = Express.Router();

router.post(ROUTES.ADMIN.LOGIN, adminLoginController.login );
router.get( ROUTES.ADMIN.USER_MANAGEMENT.USERS.BASE, authHandler(tokenService), userManagementController.getAllUsers);
router.patch(
 `${ROUTES.ADMIN.USER_MANAGEMENT.USERS.BASE}${ROUTES.ADMIN.USER_MANAGEMENT.USERS.STATUS}`,
 authHandler(tokenService),
 userManagementController.toggleUserStatus
);
export default router;