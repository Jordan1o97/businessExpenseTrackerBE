import { Request, Response, NextFunction } from "express";
import { User } from "./DTO/User";
import jwt from "jsonwebtoken";
import { setCurrentUserId } from "./globals";

interface AuthRequest extends Request {
  user?: User;
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  console.log(authHeader)
  const token = authHeader;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT secret is not defined");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any as User;
    const decodedUserId = jwt.verify(token, process.env.JWT_SECRET) as any;
    req.user = decoded;
    setCurrentUserId(decodedUserId.userId);
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};