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

  //Initialize Secret:
  const secret;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }
  console.log(authHeader)
  const token = authHeader;

  try {
    const decoded = jwt.verify(token, secret) as any as User;
    const decodedUserId = jwt.verify(token, secret) as any;
    req.user = decoded;
    setCurrentUserId(decodedUserId.userId);
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};