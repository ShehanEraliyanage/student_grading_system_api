import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserAddDto } from './dto/userAdd.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Add a new user
  async create(userAddingDto: UserAddDto): Promise<User> {
    const newUser = new this.userModel(userAddingDto);
    return newUser.save();
  }

  // Get all users
  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Get a single user by id
  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  // Delete a user by id
  async delete(id: string): Promise<any> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
