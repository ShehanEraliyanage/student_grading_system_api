import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserAddDto } from './dto/userAdd.dto';
import { User, UserDocument } from './schemas/user.schema';
import { IReqUserInfo } from 'src/auth/interfaces/req-user-Info.interface';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userAddDto: UserAddDto): Promise<User> {
    // Hash the password before creating a new user
    const hashedPassword = await bcrypt.hash(userAddDto.password, SALT_ROUNDS);
    userAddDto.password = hashedPassword;
    userAddDto.createdAt = new Date();
    userAddDto.updatedAt = new Date();

    const newUser = new this.userModel(userAddDto);

    // Save the user to the database and return the saved user
    return newUser.save();
  }

  async getUserById(_id: string): Promise<UserDocument> {
    try {
      const user = await this.userModel.findById(_id);

      if (!user) {
        throw new NotFoundException(
          `User with ID ${_id} not found in the database`,
        );
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async userMe(reqUser: IReqUserInfo): Promise<UserDocument> {
    const user = await this.userModel.findOne({
      _id: reqUser.userId,
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${reqUser.userId} not found in the database`,
      );
    }

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async delete(id: string): Promise<any> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return deletedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
