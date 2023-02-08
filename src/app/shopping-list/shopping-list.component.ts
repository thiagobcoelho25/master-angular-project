import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients!: Ingredient[]
  private ingredients_subscription!: Subscription;


  constructor(private shoppingListService: ShoppingListService) {
  }

  
  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients()
    this.ingredients_subscription = this.shoppingListService.ingredinets_changed.subscribe(ingredients => {
      this.ingredients = ingredients
    })
  }

  ngOnDestroy(): void {
    this.ingredients_subscription.unsubscribe();
  }

  onEditItem(index: number){
    this.shoppingListService.startedEditing.next(index)
  }

}
