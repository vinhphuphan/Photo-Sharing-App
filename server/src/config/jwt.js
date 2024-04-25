import jwt from "jsonwebtoken";
import { responseData } from "./config.js";

// Define secret keys for JWT
const secretKey = process.env.JWT_SECRET_KEY || 'defaultSecretKey';
const secretKeyRef = process.env.JWT_REFRESH_SECRET_KEY || 'defaultRefreshSecretKey';

// Token expiration times
const accessTokenExpiration = "5m";
const refreshTokenExpiration = "10d";

// Create access_token
export const createAccessToken = (data) => jwt.sign(data, secretKey, { expiresIn: accessTokenExpiration });

// Create refresh_token
export const createRefreshToken = (data) => jwt.sign(data, secretKeyRef, { expiresIn: refreshTokenExpiration });

// Verify access_token
export const verifyAccessToken = (token) => jwt.verify(token, secretKey);

// Verify refresh_token
export const verifyRefreshToken = (token) => jwt.verify(token, secretKeyRef);

// Decode Token
export const decodeToken = (token) => jwt.decode(token);

// Middleware to verify access_token
export const verifyAccessTokenMiddleware = (req, res, next) => {
    const token = req.headers;

    if (!token) {
        return responseData(res, "Access token is missing" , 401 , "");
    }

    try {
        const decodedToken = verifyAccessToken(token);
        req.user = decodedToken; // Attach decoded user information to the request object
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Access token has expired" });
        } else {
            return res.status(401).json({ error: "Invalid access token" });
        }
    }
};
