import { Request, Response } from "express";
import Category, { CategoryType } from "../models/Category";
import User from "../models/User";
import { validationResult } from "express-validator";
import * as adsService from "../services/adsService";
import { v4 } from "uuid";
import multer from "multer";
import sharp from "sharp";
import { unlink } from "fs/promises";

// const storageConfig = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "./tmp");
//   },
//   filename: (req, file, callback) => {
//     callback(null, `${v4()}.jpg`);
//   },
// });

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    callback(null, allowed.includes(file.mimetype));
  },
  limits: {
    fileSize: 20000000,
  },
});

export const getCategories = async (req: Request, res: Response) => {
  const categoriesList = await Category.find();

  let categoriesWithImgs: CategoryType[] = [];

  categoriesList.forEach((item) => {
    categoriesWithImgs.push({
      ...item._doc,
      img: `${process.env.BASE}/assets/images/${item.slug}.png`,
    });
  });
  res.json({ categoriesWithImgs });
};

export const addAction = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const token: string = req.body.token;
    const title: string = req.body.title;
    const price: number = req.body.price;
    const priceNegotiable: boolean = req.body.pricenegotiable;
    const description: string = req.body.description;
    const category: string = req.body.category;
    const image = req.file as File | undefined;

    console.log(req.files);

    const arrImages: string[] = [];

    if (req.files) {
      (req.files as any[]).forEach(async (item) => {
        const randUuid = v4();
        const imageUrl = `http://localhost:5000/media/${randUuid}.jpg`;
        arrImages.push(imageUrl);
        await sharp(item.buffer)
          .resize(500)
          .toFormat("jpg")
          .toFile(`./public/media/${randUuid}.jpg`);
      });

      const createAd = await adsService.createAd(
        token,
        title,
        price,
        priceNegotiable,
        description,
        category,
        arrImages
      );

      if (createAd instanceof Error) {
        return res.status(400).json({ error: createAd.message });
      } else {
        return res.json({ createAd });
      }
    } else {
      return res.status(400).json({ error: "Arquivo inválido" });
    }
  } else {
    return res.json({ error: errors.mapped() });
  }
};

//_______________________
export const getList = (req: Request, res: Response) => {
  res.json({ pong: true });
};
export const getItem = (req: Request, res: Response) => {
  res.json({ pong: true });
};
export const editAction = (req: Request, res: Response) => {
  res.json({ pong: true });
};
