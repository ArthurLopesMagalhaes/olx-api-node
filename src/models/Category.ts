import { Schema, Model, model, connection, Document } from "mongoose";

export interface CategoryType extends Document {
  name: string;
  slug: string;
  _doc?: any;
}

const schema = new Schema<CategoryType>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
});

const modelName = "Category";

export default connection && connection.models[modelName]
  ? (connection.models[modelName] as Model<CategoryType>)
  : model<CategoryType>(modelName, schema);
