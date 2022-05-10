import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const privateRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.token || req.params.token;
  if (token) {
    const user = await User.findOne({ token });
    if (user) {
      return next();
    }
  }
  res.json({ notallowed: true });
};
