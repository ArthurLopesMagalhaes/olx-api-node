import { Request, Response, NextFunction } from "express";
import passport from "passport";
import dotenv from "dotenv";
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import jwt from "jsonwebtoken";
import User from "../models/User";

dotenv.config();

const notAuthorizedJson = { status: 401, message: "Não autorizado" };

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JWTStrategy(options, async (payload, done) => {
    const user = await User.findOne({ email: payload.email });
    if (user) {
      return done(null, user);
    } else {
      return done(notAuthorizedJson, false);
    }
  })
);

export const generateToken = (data: object) => {
  return jwt.sign(data, process.env.JWT_SECRET as string);
};

export const privateRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate("jwt", (err, user) => {
    req.user = user;
    return user ? next() : next(notAuthorizedJson);
  })(req, res, next);
};

export default passport;
