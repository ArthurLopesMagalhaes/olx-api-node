import { Request, Response } from "express";

import State from "../models/State";

export const getStates = async (req: Request, res: Response) => {
  let states = await State.find();
  res.json({ states });
};

export const info = async (req: Request, res: Response) => {
  res.json({});
};

export const editAction = async (req: Request, res: Response) => {
  res.json({});
};
