import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit {
  id!: number
  editMode: boolean = false
  recipe_form!: FormGroup

  constructor(private activatedRoute: ActivatedRoute, private recipeService: RecipeService, private router: Router){

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.id = +params['id']
      this.editMode = params['id'] != null
      this.initForm();
    })
  }

  onSubmit(){
    const new_recipe: Recipe = new Recipe(this.recipe_form.value['name'], this.recipe_form.value['recipe_description'], 
      this.recipe_form.value['image_path'], this.recipe_form.value['ingredients_controls']) 
    if(this.editMode){
      this.recipeService.updateRecipe(this.id, new_recipe)
    } else {
      this.recipeService.addRecipe(new_recipe)
    }

    this.onCancel();
  }

  private initForm(){
    let recipe_name = '';
    let recipe_image_path = '';
    let recipe_description = '';
    let recipe_ingredients = new FormArray<AbstractControl>([])

    if (this.editMode){
      const recipe = this.recipeService.getRecipe(this.id)
      recipe_name = recipe.name
      recipe_image_path = recipe.image_path
      recipe_description = recipe.description
      if(recipe['ingredients']){
        recipe.ingredients.forEach(ingredient => {
          recipe_ingredients.push(
            new FormGroup({
              name: new FormControl(ingredient.name, Validators.required),
              amount: new FormControl(ingredient.amount, [Validators.required, Validators.min(1)])
            })
          )
        }) 
      }
    }

    this.recipe_form = new FormGroup({
      name: new FormControl(recipe_name, Validators.required),
      image_path: new FormControl(recipe_image_path, Validators.required),
      'recipe_description': new FormControl(recipe_description, Validators.required),
      ingredients_controls: recipe_ingredients
    })
  }

  get controls() { // a getter!
    return (<FormArray>this.recipe_form.get('ingredients_controls')).controls;
  }

  onAddINgredient(){
    (<FormArray>this.recipe_form.get('ingredients_controls')).push(new FormGroup({
      name: new FormControl('', Validators.required),
      amount: new FormControl(0, [Validators.required, Validators.min(1)])
    }))
  }

  onCancel(){
    this.router.navigate(['../'], {relativeTo: this.activatedRoute})
  }

  onDeleteIngredient(index: number){
    (<FormArray>this.recipe_form.get('ingredients_controls')).removeAt(index)
  }

}
