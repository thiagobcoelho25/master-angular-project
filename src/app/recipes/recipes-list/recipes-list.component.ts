import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit, OnDestroy{
  recipes!: Recipe[]
  subscription!: Subscription

  constructor(private recipeService: RecipeService, private router: Router, private activatedRoute: ActivatedRoute) {
  }
  
  ngOnInit(): void {
    this.subscription =  this.recipeService.recipes_changes.subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    })
    this.recipes = this.recipeService.getRecipes()
  }

  onNewRecipe(){
    this.router.navigate(['new'], {relativeTo: this.activatedRoute})
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  
}
