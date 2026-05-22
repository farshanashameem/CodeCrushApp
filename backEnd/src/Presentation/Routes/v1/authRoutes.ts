import { authHandler } from "@/Presentation/Middlewares/AuthMiddleware";
import { tokenService } from "@/Presentation/Factory/ParentFactory";
import { ROUTES } from "@/Shared/Routes";
import Express from "express";
import { authController } from "@/Presentation/Factory/AuthFactory";

const router = Express.Router();

router.get( ROUTES.AUTH.ME, authHandler(tokenService),authController.getMe);
router.post( ROUTES.AUTH.REFRESH, authController.refreshToken);
router.post( ROUTES.AUTH.LOGOUT, authController.logout);

export default router;