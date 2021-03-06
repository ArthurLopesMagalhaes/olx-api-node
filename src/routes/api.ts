import { Request, Response, Router } from "express";

import multer from "multer";

import { privateRoute } from "../config/passport";
import * as AuthValidator from "../validators/AuthValidator";
import * as UserValidator from "../validators/UserValidator";
import * as AdsValidator from "../validators/AdsValidator";

import * as AuthController from "../controllers/authController";
import * as AdsController from "../controllers/adsController";
import * as UserController from "../controllers/userController";

const router = Router();

router.get("/ping", (req: Request, res: Response) => {
  res.json({ pong: true });
});

router.get("/states", UserController.getStates);
router.get("/user/me", privateRoute, UserController.info);
router.put(
  "/user/me",
  UserValidator.editAction,
  privateRoute,
  UserController.editAction
);

router.post("/user/signin", AuthValidator.signIn, AuthController.signIn);
router.post("/user/signup", AuthValidator.signUp, AuthController.signUp);

router.get("/categories", AdsController.getCategories);
router.post(
  "/ad/add",
  privateRoute,
  AdsController.upload.array("images", 10),
  AdsValidator.addAd,
  AdsController.addAction
);
router.get("/ad/list", AdsController.getList);
router.get("/ad/item", AdsController.getItem);

router.post(
  "/ad/:id",
  privateRoute,
  AdsController.upload.array("images", 10),
  AdsValidator.editAd,
  AdsController.editAction
);

export default router;
