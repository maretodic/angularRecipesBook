import { Recipe } from './recipe.model';
import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService{

  recipeChanged = new Subject<Recipe[]>();

  //  private recipes: Recipe[] = [
  //       // tslint:disable-next-line: max-line-length
  //       new Recipe('Bolonjeze', 
  //        'Ukusne spagete sa mesom', 
  //        'https://carlsbadcravings.com/wp-content/uploads/2017/02/Weeknight-Spaghtetti-Bolognese-15-600x900.jpg',
  //        [
  //            new Ingredient('Testenina', 500),
  //            new Ingredient('Meso', 500),
  //            new Ingredient('Paradajz sos', 400)
  //        ]),
  //       // tslint:disable-next-line: max-line-length
  //       new Recipe('Karbonara', 
  //       'Idealan nacin da zapocnete dan',
  //        'https://www.oliviascuisine.com/wp-content/uploads/2019/01/authentic-spaghetti-carbonara-IG-720x540.jpg',
  //        [
  //            new Ingredient('Testenina', 500),
  //            new Ingredient('Jaja', 5),
  //            new Ingredient('Slanina', 300),
  //            new Ingredient('Parmezan', 200)
  //        ])
  //     ];

      private recipes: Recipe[] = [];

      constructor(private sLService: ShoppingListService) {}

      setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
      }

      getRecipes() {
        return this.recipes.slice();
      }

      getRecipe(id: number) {
        return this.recipes[id];
      }

      addIngToList(ingredients: Ingredient[]) {
        this.sLService.addIngredients(ingredients);
      }

      addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice()); 
      }

      updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipeChanged.next(this.recipes.slice()); 
      }

      deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice());
      }
}