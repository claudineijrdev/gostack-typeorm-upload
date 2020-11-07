import { CreateDateColumn, getRepository } from "typeorm";
import Category from "../models/Category";


class CreateCategoryService {
  public async execute(title: string): Promise<Category> {
    const categoryRepository = getRepository(Category)

    const oldCategory = await categoryRepository.findOne({
      where: { title }
    })

    if (oldCategory) {
      return oldCategory
    }

    const category = categoryRepository.create({ title })

    await categoryRepository.save(category)

    return category
  }
}
export default CreateCategoryService
