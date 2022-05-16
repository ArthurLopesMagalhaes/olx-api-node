import { isValidObjectId } from "mongoose";
import Ad from "../models/Ad";
import Category from "../models/Category";
import State from "../models/State";
import User from "../models/User";

export const createAd = async (
  token: string,
  title: string,
  price: number,
  priceNegotiable: boolean,
  description: string,
  category: string,
  arrImages: string[]
) => {
  const user = await User.findOne({ token });
  const categoryDB = await Category.findOne({ slug: category });

  if (user) {
    const newAd = Ad.create({
      idUser: user._id,
      state: user.state,
      category: categoryDB?._id.toString(),
      images: arrImages,
      dateCreated: new Date(),
      title: title,
      price: price,
      priceNegotiable: priceNegotiable,
      description: description,
      views: 0,
      status: true,
    });
    return newAd;
  } else {
    return new Error("Token invalido");
  }
};

export const listAds = async (
  sort: string,
  offset: number,
  limit: number,
  querySearch: string,
  category: string,
  state: string
) => {
  type AdsType = {
    id: number;
    title: string;
    price: number;
    priceNegotiable: boolean;
    images: string[];
  };

  let ads: any[] = [];

  const filters: any = { status: true };

  if (querySearch) {
    filters.title = { $regex: querySearch, $options: "i" };
  }

  if (category) {
    const categoryDB = await Category.findOne({ slug: category });
    try {
      filters.category = categoryDB?._id.toString();
    } catch (error) {
      console.error("Something went wrong");
    }
  }

  if (state) {
    const stateDB = await State.findOne({ name: state.toUpperCase() });
    try {
      filters.state = stateDB?._id.toString();
    } catch (error) {
      console.error("Something went wrong");
    }
  }

  const adsData = await Ad.find(filters)
    .sort({
      dateCreated: sort === "desc" ? -1 : 1,
    })
    .skip(offset)
    .limit(limit);

  if (adsData) {
    adsData.forEach((item) => {
      ads.push({
        id: item._id,
        title: item.title,
        price: item.price,
        priceNegotiable: item.priceNegotiable,
        images: item.images,
      });
    });

    return ads;
  } else {
    return new Error("Nenhum anúncio encontrado");
  }
};

export const getItem = async (id: string, other: boolean) => {
  if (isValidObjectId(id)) {
    const adDB = await Ad.findById(id);
    const category = await Category.findById(adDB?.category);
    const userInfo = await User.findById(adDB?.idUser);
    const stateInfo = await State.findById(adDB?.state);

    const otherProducts: any[] = [];

    if (other) {
      const otherData = await Ad.find({
        status: true,
        idUser: adDB?.idUser,
      }).limit(5);

      otherData.map((item) => {
        if (item._id.toString() !== id) {
          otherProducts.push({
            id: item._id,
            title: item.title,
            price: item.price,
            priceNegotiable: item.priceNegotiable,
            images: item.images,
          });
        }
      });
    }

    try {
      if (adDB) {
        adDB.views++;
        await adDB.save();

        const ad = {
          id: adDB._id,
          title: adDB.title,
          price: adDB.price,
          priceNegotiable: adDB.priceNegotiable,
          description: adDB.description,
          dateCreated: adDB.dateCreated,
          views: adDB.views,
          images: adDB.images,
          category: category,
          userInfo: {
            name: userInfo?.name,
            email: userInfo?.email,
          },
          stateName: stateInfo?.name,
          otherProducts,
        };

        return ad;
      } else {
        return new Error("Produto inexistente");
      }
    } catch (error) {
      return new Error("ID inválido");
    }
  } else {
    return new Error("ID inválido");
  }
};

export const editItem = async (
  token: string,
  id: string,
  title: string,
  description: string,
  price: number,
  priceNegotiable: boolean,
  category: string,
  status: boolean,
  arrImages: string[]
) => {
  if (isValidObjectId(id)) {
    const ad = await Ad.findById(id);

    if (!ad) {
      return new Error("Anúncio não encontrado");
    }

    const user = await User.findOne({ token });
    if (user?._id.toString() !== ad.idUser) {
      return new Error("Este anuncio não é deste usuário");
    }

    let updates: any = {};

    if (title) {
      updates.title = title;
    }

    if (price) {
      updates.price = price;
    }
    if (priceNegotiable) {
      updates.price = priceNegotiable;
    }
    if (status) {
      updates.status = status;
    }
    if (description) {
      updates.description = description;
    }
    if (category) {
      const categoryDB = await Category.findOne({ slug: category });
      if (!categoryDB) {
        return new Error("Essa categoria não existe");
      }
      updates.category = categoryDB._id.toString();
    }
    if (arrImages.length > 0) {
      updates.images = arrImages;
    }

    await Ad.findByIdAndUpdate(id, { $set: updates });

    return updates;
  } else {
    return new Error("ID inválido");
  }
};
