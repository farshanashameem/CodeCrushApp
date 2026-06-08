import Express  from 'express';
import v1Routes from './v1/index';

const router = Express.Router();

router.use('/v1', v1Routes);

export default router;