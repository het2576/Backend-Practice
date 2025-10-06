import jwt from 'jsonwebtoken';
const JWT_ADMIN_PASSWORD ='admin@123';

export function adminMiddleware(req, res, next) {       
    const token = req.headers.token
    const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD)
    if (decoded) {
        req.userId = decoded.userId
        next();
    } else {
        res.status(403).json({
            msg: "Incorrect credentials"
        })
    }
}

export default adminMiddleware;