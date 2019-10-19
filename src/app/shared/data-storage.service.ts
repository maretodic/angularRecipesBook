import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';


@Injectable({providedIn: 'root'})
export class DataStorageService {
    constructor(private http: HttpClient, 
                private recipeService: RecipeService, 
                private authService: AuthService) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        return this.http.put('https://ngkuvar21.firebaseio.com/recipes.json', recipes)
        .subscribe(response => {
            console.log(response);
        });
    }

    getRecipes() {
        
            return this.http.get<Recipe[]>('https://ngkuvar21.firebaseio.com/recipes.json').pipe(
                map(recipes => {
                    return recipes.map(recipe => {
                        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []
                        };
                    });
                }),
                tap(recipes => {
                    this.recipeService.setRecipes(recipes);
                }));
            
        //const token = this.authService.getIdToken();
         //return this.http.get<Recipe[]>('https://ngkuvar21.firebaseio.com/recipes.json?auth=' + token)
        
    }
}