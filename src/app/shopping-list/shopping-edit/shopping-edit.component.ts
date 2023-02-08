import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.scss']
})
export class ShoppingEditComponent implements OnInit, OnDestroy{
  form_group: FormGroup
  subscription!: Subscription
  editMode: boolean = false
  editedItemIndex!: number
  editItem!: Ingredient

  constructor(private shoppingListService: ShoppingListService) {
    this.form_group = new FormGroup({
      name: new FormControl('', Validators.required),
      amount: new FormControl(0, Validators.compose([Validators.required, Validators.min(1)])),
    })
  }

  ngOnInit(): void {
    this.subscription = this.shoppingListService.startedEditing.subscribe((index: number) => {
      this.editedItemIndex = index
      this.editMode = true;
      this.editItem = this.shoppingListService.getIngredient(index)

      this.form_group.setValue({name: this.editItem.name, amount: this.editItem.amount})
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  onSubmit() {
    const ingredient = new Ingredient(this.form_group.get('name')?.value, this.form_group.get('amount')?.value)
    
    if(this.editMode){
      this.shoppingListService.updateIngredient(this.editedItemIndex, ingredient)
    } else {
      this.shoppingListService.addIngredient(ingredient)
    }

    this.editMode = false
    this.form_group.reset()
  }

  onClear(){
    this.form_group.reset()
    this.editMode = false
  }

  onDelete(){
    this.shoppingListService.deleteIngredient(this.editedItemIndex)
    this.onClear()
  }

}
