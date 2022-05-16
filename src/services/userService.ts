import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";

import State from "../models/State";
import User from "../models/User";
import Ad, { AdType } from "../models/Ad";

import { generateToken } from "../config/passport";
import Category from "../models/Category";

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

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (user) {
    const match = await bcrypt.compare(password, user.passwordHash);
    if (match) {
      const token: string = generateToken({ email });
      user.token = token;
      await user.save();
      return { token, email };
    } else return new Error("E-mail e/ou senha inválidos.");
  } else {
    return new Error("E-mail e/ou senha inválidos.");
  }
};

export const FindUsersDetails = async (token: string) => {
  const user = await User.findOne({ token });
  if (user) {
    const userState = await State.findById(user.state);

    const userAds = await Ad.find({ idUser: user._id });

    let adList: any[] = [];

    userAds.forEach(async (item) => {
      const cat = await Category.findById(item.category);
      adList.push({ item, category: cat?.slug });
    });

    const userDetails = {
      name: user.name,
      email: user.email,
      state: userState?.name,
      ads: adList,
    };
    console.log(userDetails);

    return userDetails;
  } else {
    return new Error("Usuário não encontrado");
  }
};

export const editAction = async (
  token: string,
  name: string | undefined,
  email: string | undefined,
  state: string | undefined,
  password: string | undefined
) => {
  const user = await User.findOne({ token });
  console.log(token);
  console.log(user);
  if (user) {
    type UpdateType = {
      name?: string;
      email?: string;
      state?: string;
      password?: string;
    };

    let updates: UpdateType = {};

    if (name) {
      updates.name = name;
    }

    if (email) {
      const checkEmail = await User.findOne({ email });
      updates.email = email;
      if (checkEmail) {
        return new Error("E-mail já cadastrado");
      }
    }

    if (isValidObjectId(state)) {
      if (state) {
        const checkState = await State.findOne({ state });
        if (!checkState) {
          return new Error("Estado inválido");
        }
        updates.state = state;
      }
    } else {
      return new Error("Estado inválido");
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10);
      updates.password = passwordHash;
    }

    await User.findOneAndUpdate({ token }, { $set: updates });
  } else {
    return new Error("Usuário não encontrado");
  }
};
