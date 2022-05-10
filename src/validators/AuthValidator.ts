import { checkSchema } from "express-validator";

export const signUp = checkSchema({
  name: {
    trim: true,
    isLength: {
      options: { min: 2 },
    },
    errorMessage: "Nome precisa ter pelo menos 2 caracteres.",
  },
  email: {
    isEmail: true,
    normalizeEmail: true,
    errorMessage: "E-mail inválido.",
  },
  password: {
    isLength: {
      options: { min: 8 },
    },
    errorMessage: "Senha precisa ter pelo menos 8 caracteres.",
  },
  state: {
    notEmpty: true,
    errorMessage: "Estado não preenchido.",
  },
});
