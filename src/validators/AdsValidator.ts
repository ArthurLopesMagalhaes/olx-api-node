import { checkSchema } from "express-validator";

export const addAds = checkSchema({
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

export const listAds = checkSchema({
  sort: {
    optional: true,
    trim: true,
  },
  offset: {
    optional: true,
  },
  limit: {
    optional: true,
  },
  search: {
    optional: true,
    trim: true,
  },
  category: {
    optional: true,
    trim: true,
  },
  state: {
    optional: true,
    trim: true,
  },
});

export const adItem = checkSchema({
  id: {
    notEmpty: true,
    errorMessage: "ID da promoção não enviado",
  },
  other: {
    optional: true,
  },
});

export const adChange = checkSchema({
  id: {
    notEmpty: true,
    errorMessage: "ID da promoção não enviado",
  },
  token: {
    notEmpty: true,
    errorMessage: "Token não enviado",
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
  status: {
    optional: true,
  },
});
