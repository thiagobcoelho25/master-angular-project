import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipes-detail',
  templateUrl: './recipes-detail.component.html',
  styleUrls: ['./recipes-detail.component.scss']
})
export class RecipesDetailComponent  implements OnInit{
  recipe!: Recipe
  id!: number

  constructor(private recipeService: RecipeService, private activatedRoute: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      // this.id = parseInt(params['id'])
      this.id = +params['id'];
      this.recipe = this.recipeService.getRecipe(this.id); 
    });
  }

  onAddToShoppingList() {
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients)
  }

  onEditRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.activatedRoute})
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.activatedRoute})
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id)
    this.router.navigate(['/recipes'])
  }

}
