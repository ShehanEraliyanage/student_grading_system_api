import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ClassAddDto } from './dto/classAdd.dto';
import { Class, ClassDocument } from './schemas/class.schema';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<ClassDocument>,
  ) {}

  async getClassByName(name: string, year: number): Promise<Class> {
    return this.classModel.findOne({
      name,
      year,
    });
  }

  async create(classAddDto: ClassAddDto): Promise<Class> {
    const existingClass = await this.getClassByName(
      classAddDto.name,
      classAddDto.year,
    );
    if (existingClass) {
      throw new NotFoundException(
        `Class with name ${classAddDto.name} and year ${classAddDto.year} already exists`,
      );
    }
    classAddDto.createdAt = new Date();
    classAddDto.updatedAt = new Date();
    const newClass = new this.classModel(classAddDto);
    return newClass.save();
  }

  async findAllClasses(): Promise<Class[]> {
    return this.classModel.find().sort({ year: -1 }).exec();
  }
}
