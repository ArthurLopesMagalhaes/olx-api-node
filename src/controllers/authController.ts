import { Request, Response } from "express";
import mongoose from "mongoose";

import { validationResult, matchedData } from "express-validator";

import User, { UserType } from "../models/User";
import State from "../models/State";
import * as userService from "../services/userService";

export const signIn = (req: Request, res: Response) => {
  res.json({ pong: true });
};

export const signUp = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { name, email, state, password } = req.body;
    const newUser = await userService.createUser(name, email, state, password);
    if (newUser instanceof Error) {
      return res.status(400).json({ error: newUser.message });
    } else if (newUser) {
      const data = matchedData(req);
      return res.status(201).json({
        newUser,
        data,
      });
    }
  } else {
    res.json({ error: errors.mapped() });
  }
};
