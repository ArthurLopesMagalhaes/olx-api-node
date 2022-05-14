import Ad from "../models/Ad";
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

  if (user) {
    const newAd = Ad.create({
      idUser: user._id,
      state: user.state,
      category: category,
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
