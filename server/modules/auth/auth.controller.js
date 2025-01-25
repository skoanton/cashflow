import { login, register } from './auth.service.js';

export const loginHandler = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const token = await login(email, password);
        res.json({ token });
    }
    catch (error) {
        res.status(401).send(error.message);
    }
}

export const registerHandler = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const newUser = await register(email, password);
        if (newUser) {
            res.status(201).json({ message: "User created successfully." });
        }
        else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
    catch (error) {
        if (error.message === "User already exists") {
            res.status(409).json({ error: "Email already in use." });
        } else {
            res.status(500).json({ error: "Internal server error." });
        }
    }
}