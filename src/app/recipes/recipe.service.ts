import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipes_changes = new Subject<Recipe[]>
  private recipes: Recipe[] = []

  // private recipes: Recipe[] = [new Recipe("A teste recipe", "simple a teste", "https://upload.wikimedia.org/wikipedia/commons/5/57/990402-ians-recipe-01-IMG_4724.jpg", [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)]),
  // new Recipe("Anoter teste", "simple a teste", "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Parboiled_rice_with_chicken%2C_peppers%2C_cucurbita%2C_peas_and_tomato.jpg/640px-Parboiled_rice_with_chicken%2C_peppers%2C_cucurbita%2C_peas_and_tomato.jpg", [new Ingredient('pineple', 5), new Ingredient('watermelon', 10)])]

  constructor(private slService: ShoppingListService) { }

  setRecipes(recipes: Recipe[]){
    this.recipes = recipes
    this.recipes_changes.next(this.recipes.slice())
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number){
    return this.recipes[index]
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients)
  }

  addRecipe(recipe: Recipe){
    this.recipes.push(recipe)
    this.recipes_changes.next(this.recipes.slice());
  }

  updateRecipe(index: number, new_recipe: Recipe){
    this.recipes[index] = new_recipe
    this.recipes_changes.next(this.recipes.slice());
  }

  deleteRecipe(index: number){
    this.recipes.splice(index, 1)
    this.recipes_changes.next(this.recipes.slice());
  }
}
