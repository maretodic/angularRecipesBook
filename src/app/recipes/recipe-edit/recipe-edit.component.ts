import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { RecipeService } from '../recipe.service';


@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  get ingredientsControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls;
  }

  constructor(private route: ActivatedRoute, 
    private recipeService: RecipeService,
    private Router: Router) { }

    ngOnInit() {
      this.route.params.subscribe((params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      });
    }

  onCancel() {
    this.Router.navigate(['../'], {relativeTo: this.route});
  }

  onSubmit() {
    // const newRecipe = new Recipe(this.recipeForm.value['name'], 
    //   this.recipeForm.value['description'], 
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']
    //   );
    if(this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  onAddIng() {
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      name: new FormControl('', Validators.required),
      amount: new FormControl(null, [
        Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)
      ])
    }))
  }


  onDeleteIng(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  private initForm() {
    
    let recipeName = '';
    let recipeImgPath = '';
    let recipeDesc = '';
    let recipeIngedients = new FormArray([]);
    
    if(this.editMode){
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImgPath = recipe.imagePath;
      recipeDesc = recipe.description;
      if(recipe['ingredients']) {
        for( let ing of recipe.ingredients) {
          recipeIngedients.push(
            new FormGroup({
              name: new FormControl(ing.name, Validators.required),
              amount: new FormControl(ing.amount, [
                Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          )
        }
      }
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImgPath, Validators.required),
      description: new FormControl(recipeDesc, Validators.required),
      ingredients: recipeIngedients
    });
  }

}
