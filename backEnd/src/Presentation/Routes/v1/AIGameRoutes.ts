import Express from 'express';

import { ROUTES } from '@/Shared/Routes';
import { verifyChildSessionMiddleware } from '@/Presentation/Factory/ChildFactory';
import { createAIGameController } from '@/Presentation/Factory/AIGameFactory';
import { validateCreateAIGame } from '@/Presentation/Middlewares/AIGameValidator.middleware';

const router = Express.Router();

router.use(verifyChildSessionMiddleware.execute);

router.post( ROUTES.AI_GAME.GENERATE,validateCreateAIGame, createAIGameController.handle );

export default router;