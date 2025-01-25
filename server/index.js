import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import goCardLessRoutes from './modules/goCardLess/goCardLess.routes.js';
import { authenticate } from './middleware/middleware.js';
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/bank", authenticate, goCardLessRoutes);
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});


