import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async add(userId: string, token: string, expireDate: Date) {
    // Look for userId in mongo
    const userFound = await this.userModel.findOne({ _id: userId }).exec();

    // If it doesn't exist add it
    if (!userFound) {
      const createdUser = await this.userModel.create({
        _id: userId,
        token: token,
        expiry: expireDate,
      });
      createdUser.save();
    } else {
      // Otherwise update the token and expire date
      await this.userModel
        .findByIdAndUpdate({ _id: userId }, { token: token, expiry: expireDate }, { new: true })
        .exec();
    }
  }

  handlerLogin() {}

  handlerRedirect() {
    return 'Google account connected! (Now you can close this window)';
  }

  async status(): Promise<Boolean>  {
    const user = await this.userModel.findOne().exec();
    return user != null;
  }
}
