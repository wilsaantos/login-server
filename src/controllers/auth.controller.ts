import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/user.service";

import authConfig from "../config/auth.json";

const router = express.Router();
const authController = router;
const userService = new UserService();

router.post("/register", async (req, res) => {
  const body = req.body;

  try {
    if (await userService.findByEmailOrNickname(body.email))
      return res.status(400).send({
        error: "Conta Já Cadastrada",
      });

    const hash = await bcrypt.hash(req.body.password, 10);
    req.body.password = hash;

    const user = await userService.create(req.body);

    return res.status(201).send({
      message: "Conta Registrada Com Sucesso.",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({
      error: err,
      message: 'Falha ao Registrar Conta.'
    });
  }
});

router.post("/authenticate", async (req, res) => {
  const { input, password } = req.body;

  const user = await userService.findByEmailOrNickname(input);

  if (!user)
    return res.status(404).send({
      message: "Conta Não Encontrada",
    });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(400).send({
      message: "Senha Inválida",
    });

  user.password = "";

  const token = jwt.sign(
    {
      id: user.id,
    },
    authConfig.secret,
    {
      expiresIn: 86400,
    }
  );

  res.send({
    user,
    token,
  });
});

export default authController;