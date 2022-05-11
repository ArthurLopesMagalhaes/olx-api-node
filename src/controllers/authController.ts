import { Request, Response } from "express";
import mongoose from "mongoose";

import { validationResult, matchedData } from "express-validator";

import User, { UserType } from "../models/User";
import State from "../models/State";
import * as userService from "../services/userService";

export const signIn = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const { email, password } = req.body;

    const user = await userService.loginUser(email, password);

    if (user instanceof Error) {
      return res.status(400).json({ error: user.message });
    } else {
      const data = matchedData(req);

      return res.status(200).json({
        user,
        email: data.email,
      });
    }
  } else {
    res.json({ error: errors.mapped() });
  }
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
