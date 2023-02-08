import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
    
    constructor(private data_storage_service: DataStorageService, private recipes_services: RecipeService){}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        const recipes = this.recipes_services.getRecipes()

        if(recipes.length === 0){
            return this.data_storage_service.fetchRecipes()  
        } else {
            return recipes
        }
    }

}