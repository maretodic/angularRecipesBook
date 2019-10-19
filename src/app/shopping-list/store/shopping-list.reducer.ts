
import { Ingredient } from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';

const initialState = {
    ingredients: [
        new Ingredient('Testenina', 1),
        new Ingredient('Jaja', 4),
        new Ingredient('Slanina', 300)
    ]
};

export function shoppingListReducer(state = initialState, action: ShoppingListActions.AddIngredient) {
    switch (action.type) {
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };
    }
}