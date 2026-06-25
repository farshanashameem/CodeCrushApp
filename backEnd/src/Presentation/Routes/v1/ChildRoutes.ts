import Express from "express";
import { ROUTES } from "@/Shared/Routes";
import { startChildSessionController, endChildSessionController,  verifyChildSessionMiddleware } from "@/Presentation/Factory/ChildFactory";
import { childGameController } from "@/Presentation/Factory/ChildFactory";
import { authHandler } from "@/Presentation/Middlewares/AuthMiddleware";
import { tokenService } from "@/Presentation/Factory/ParentFactory";
import { childProgressController } from "@/Presentation/Factory/ChildFactory";

const router = Express.Router();

// Parent starts gaming
router.post(  ROUTES.CHILD.SESSION.START, authHandler(tokenService), startChildSessionController.startSession) ;

// Child authenticated routes
router.use(  verifyChildSessionMiddleware.execute );

// End session
router.post( ROUTES.CHILD.SESSION.END, endChildSessionController.endSession );

// Games
router.get( ROUTES.CHILD.GAME.ALL, childGameController.getAllGames );

router.get( ROUTES.CHILD.GAME.BY_ID ,childGameController.getGame );

router.get(  ROUTES.CHILD.GAME.LEVELS, childGameController.getLevelsByGame );
router.get ( ROUTES.CHILD.GAME.LEVELS_BY_ID,childGameController.getLevel );
//router.post( ROUTES.CHILD.GAME.START_LEVEL,  childGameController.startLevel );

router.post( ROUTES.CHILD.GAME.SUBMIT_LEVEL, childProgressController.submitProgress );
router.get( ROUTES.CHILD.PROGRESS.BY_GAME, childProgressController.getProgressData );
export default router;