import { Ingredient } from "../shared/ingredient.model";

export class Recipe {
  public name: string;
  public description: string;
  public image_path: string;
  public ingredients: Ingredient[]

  constructor(name: string, description: string, image_path: string, ingredients: Ingredient[]) {
    this.name = name
    this.description = description
    this.image_path = image_path
    this.ingredients = ingredients
  }
}
