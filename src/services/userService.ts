import { isValidObjectId } from "mongoose";

import State from "../models/State";
import User from "../models/User";
import bcrypt from "bcrypt";
import { generateToken } from "../config/passport";

export const createUser = async (
  name: string,
  email: string,
  state: string,
  password: string
) => {
  if (isValidObjectId(state)) {
    const [hasUser, hasState] = await Promise.all([
      User.findOne({ email }),
      State.findById(state),
    ]);

    console.log(state);
    console.log(hasState);

    const hash: string = bcrypt.hashSync(password, 10);
    const token: string = generateToken({ email });

    if (!hasUser && hasState) {
      const newUser = await User.create({
        name,
        email,
        state,
        passwordHash: hash,
        token,
      });
      return newUser;
    }
    if (hasUser && hasState) {
      return new Error("E-mail já cadastrado");
    }
  } else {
    return new Error("Estado inválido");
  }
};
