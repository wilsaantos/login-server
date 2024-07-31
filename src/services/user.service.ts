import { prismaClient } from "../const/prisma";
import { User } from "../models/user";
export class UserService {
  public async findById(userId: number): Promise<User | null> {
    const user: User | null = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    return user;
  }

  public async findByEmailOrNickname(login: string): Promise<User | null> {
    let user: User | null = null;
    if (login.includes("@")) {
      user = await prismaClient.user.findUnique({
        where: { email: login },
      });
    } else {
      user = await prismaClient.user.findUnique({
        where: { nickname: login },
      });
    }

    return user;
  }

  async create(user: User): Promise<User | null> {
    await prismaClient.user.create({ data: user });

    const createdUser = await prismaClient.user.findUnique({
      where: { nickname: user.nickname },
    });
    return createdUser;
  }

  async update(user: User): Promise<User | null> {
    await prismaClient.user.update({ data: user, where: { id: user.id } });
    return user;
  }
}
