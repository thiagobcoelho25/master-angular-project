import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  ingredinets_changed = new Subject<Ingredient[]>();
  startedEditing= new Subject<number>();

  private ingredients: Ingredient[] = [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)];

  constructor() { }

  getIngredients() {
    return this.ingredients.slice()
  }

  getIngredient(index: number){
    return this.ingredients[index]
  }

  addIngredient(ingredient: Ingredient) {
    this.ingredients.push(ingredient)
    this.ingredinets_changed.next(this.ingredients.slice())
  }

  addIngredients(ingredients: Ingredient[]) {
    // for not emit various changes for each push
    //// for(let i of ingredients){
    ////   this.addIngredient(i)
    //// }

    this.ingredients.push(...ingredients);
    this.ingredinets_changed.next(this.ingredients.slice())
  }

  updateIngredient(index: number, new_ingredient: Ingredient){
    this.ingredients[index] = new_ingredient
    this.ingredinets_changed.next(this.ingredients.slice())
  }

  deleteIngredient(index: number){
    this.ingredients.splice(index, 1)
    this.ingredinets_changed.next(this.ingredients.slice())
  }
}
