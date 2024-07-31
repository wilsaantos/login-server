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
        message: "Conta Já Cadastrada",
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
      message: "Falha ao Registrar Conta.",
    });
  }
});

router.post("/authenticate", async (req, res) => {
  const { login, password } = req.body;

  const user = await userService.findByEmailOrNickname(login);

  if (!user)
    return res.status(404).send({
      message: "Conta Não Encontrada",
    });

  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).send({
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

  const userInfo = {
    name: user.name,
    nickname: user.nickname,
    email: user.email,
    phoneNumber: user.phoneNumber,
  };

  res.send({
    userInfo,
    token,
  });
});

export default authController;
