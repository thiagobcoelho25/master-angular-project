import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { exhaustMap, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Recipe } from '../recipes/recipe.model';
import { RecipeService } from '../recipes/recipe.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipe_services: RecipeService, private auth_service: AuthService) { }

  storeRecipes() {
    const recipes = this.recipe_services.getRecipes();
    this.http.put('https://master-angular-project-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(recipes => {
      console.log(recipes)
    })
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://master-angular-project-default-rtdb.firebaseio.com/recipes.json').pipe(map(recipes => {
      return recipes.map(recipe => {
        return { ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }
      })
    }), tap(recipes => {
      this.recipe_services.setRecipes(recipes)
    }))
  }
}
