import { Schema, Model, model, connection, ObjectId } from "mongoose";

export type AdType = {
  idUser: string;
  state: string;
  category: string | undefined;
  images: [string];
  dateCreated: Date;
  title: string;
  price: number;
  priceNegotiable: boolean;
  description: string;
  views: number;
  status: boolean;
};

const schema = new Schema<AdType>({
  idUser: { type: String, required: true },
  state: { type: String, required: true },
  category: { type: String, required: true },
  images: { type: [String], required: true },
  dateCreated: { type: Date, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  priceNegotiable: { type: Boolean, required: true },
  description: { type: String, required: true },
  views: { type: Number, required: true },
  status: { type: Boolean, required: true },
});

const modelName = "Ad";

export default connection && connection.models[modelName]
  ? (connection.models[modelName] as Model<AdType>)
  : model<AdType>(modelName, schema);
