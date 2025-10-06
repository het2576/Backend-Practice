import jwt from 'jsonwebtoken';
const JWT_USER_PASSWORD ='user@123';

export function userMiddleware(req, res, next) {       
    const token = req.headers.token
    const decoded = jwt.verify(token, JWT_USER_PASSWORD)
    if (decoded) {
        req.userId = decoded.userId
        next();
    } else {
        res.status(403).json({
            msg: "Incorrect credentials"
        })
    }
}
export default userMiddleware