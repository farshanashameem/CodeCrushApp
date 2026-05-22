import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pinoHttp from 'pino-http';
import { connectDB } from '@/Infrastructure/Config/mongo.config';
import routes from './Routes/index';
import { logger } from '../Infrastructure/Services/Logger' ;
import { errorHandler } from './Middlewares/errorHandler';;

const app = express();

app.use(
    pinoHttp({ logger })
);

app.use( cors ({
     origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

connectDB().catch(( err: any )=> {
    logger.error({err}, 'Database connection failed')
    process.exit(1)
});

app.use('/api', routes );
app.use( errorHandler );
export default app;