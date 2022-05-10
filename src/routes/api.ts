import { Request, Response, Router } from "express";

import { privateRoute } from "../config/passport";
import * as AuthValidator from "../validators/AuthValidator";

import * as AuthController from "../controllers/authController";
import * as AdsController from "../controllers/adsController";
import * as UserController from "../controllers/userController";

const router = Router();

router.get("/ping", (req: Request, res: Response) => {
  res.json({ pong: true });
});

router.get("/states", UserController.getStates);
router.get("/user/me", privateRoute, UserController.info);
router.put("/user/me", privateRoute, UserController.editAction);

router.post("/user/signin", AuthController.signIn);
router.post("/user/signup", AuthValidator.signUp, AuthController.signUp);

router.get("/categories", AdsController.getCategories);
router.post("/ad/add", privateRoute, AdsController.addAction);
router.get("/ad/list", AdsController.getList);
router.get("/ad/item", AdsController.getItem);
router.post("/ad/:id", privateRoute, AdsController.editAction);

export default router;
