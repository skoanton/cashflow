import jwt from 'jsonwebtoken';

export async function authenticate(req, res, next) {

    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json('Missing authorization token');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json('Invalid or expired token');
        }
        req.user = user;
        next();
    });
}