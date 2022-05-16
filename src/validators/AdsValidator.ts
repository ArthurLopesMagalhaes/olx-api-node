import { checkSchema } from "express-validator";

export const addAd = checkSchema({
  token: {
    notEmpty: true,
    errorMessage: "Token não enviado",
  },
  title: {
    notEmpty: true,
    trim: true,
    errorMessage: "É necessário um título para o anuncio",
  },
  price: {
    notEmpty: true,
    errorMessage: "É necessário um valor para anuncio",
  },
  pricenegotiable: {
    notEmpty: true,
    errorMessage: "É necessário informar se o anuncio é negociavel ou não",
  },
  description: {
    notEmpty: true,
    trim: true,
    errorMessage: "É necessário uma descrição para o anuncio",
  },
  category: {
    notEmpty: true,
    trim: true,
    errorMessage: "É necessário categorizar o anuncio",
  },
  status: {
    optional: true,
  },
});

export const editAd = checkSchema({
  id: {
    notEmpty: true,
    errorMessage: "ID não enviado",
  },
  token: {
    notEmpty: true,
    errorMessage: "Token não enviado",
  },
  status: {
    default: true,
    optional: true,
  },
  title: {
    optional: true,
    trim: true,
  },
  price: {
    optional: true,
  },
  pricenegotiable: {
    optional: true,
  },
  description: {
    optional: true,
    trim: true,
  },
  category: {
    optional: true,
    trim: true,
  },
});
