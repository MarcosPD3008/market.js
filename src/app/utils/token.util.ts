import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

export const generateToken = (payload: any, refreshPayload:any, expiresIn:string = "10m") => {
  const secretKey = process.env.SECRET_KEY || 'secret';
  const token = jwt.sign(payload, secretKey, {
    expiresIn: expiresIn, 
  });

  const refreshToken = jwt.sign(refreshPayload, secretKey, {
    expiresIn: '1d'
  });

  return { token, refreshToken };
}

export const decodeToken = (token: string) => {
  return jwt.decode(token, {complete: true});
}

export const auth = (req: Request, res: Response, next:NextFunction) => {
  const token = Array.isArray(req.headers?.token) ? req.headers?.token[0] : req.headers?.token;
  const config = process.env;

  if(!config.SECRET_KEY){
    res.status(500).json({message: "Server error"});
    return;
  }

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    (req as any).user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};