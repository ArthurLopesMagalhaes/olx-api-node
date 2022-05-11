import { Request, Response } from "express";
import * as userService from "../services/userService";
import { validationResult, matchedData } from "express-validator";

import State from "../models/State";

export const getStates = async (req: Request, res: Response) => {
  let states = await State.find();
  res.json({ states });
};

export const info = async (req: Request, res: Response) => {
  const [scheme, token] = (req.headers.authorization as string).split(" ");

  try {
    const userDetails = await userService.FindUsersDetails(token);
    return res.json({ userDetails });
  } catch (error) {
    res.json({ error });
  }
};

export const editAction = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const token = (req.body.token as string).substring(7);
    const { name, email, state, password } = req.body;

    const userUpdate = await userService.editAction(
      token,
      name,
      email,
      state,
      password
    );

    if (userUpdate instanceof Error) {
      return res.status(400).json({ error: userUpdate.message });
    } else {
      return res.json({ userUpdate });
    }
  } else {
    res.json({ error: errors.mapped() });
  }
};
