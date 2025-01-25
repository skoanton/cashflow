import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import goCardLessRoutes from './modules/goCardLess/goCardLess.routes';
import { authenticate } from './middleware/middleware';
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/bank", authenticate, goCardLessRoutes);
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


