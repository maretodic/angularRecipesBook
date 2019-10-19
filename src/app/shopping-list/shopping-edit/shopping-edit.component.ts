import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild ('f', {static: false}) shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  edditedNumberIndex: number; 
  edditedItem: Ingredient;

  constructor(private slS: ShoppingListService) { }

  ngOnInit() {
    this.subscription = this.slS.startedEditing.subscribe(
      (index:number) => {
        this.edditedNumberIndex = index;
        this.editMode = true;
        this.edditedItem = this.slS.getIngredient(index);
        this.shoppingListForm.setValue({
          name: this.edditedItem.name,
          amount: this.edditedItem.amount
        })
      }
    );
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIgredient = new Ingredient(value.name, value.amount);
    if(!this.editMode) {
      this.slS.addIngredient(newIgredient);
    }else {
      this.slS.updateIngredient(this.edditedNumberIndex, newIgredient);
    }

    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slS.deleteIngredient(this.edditedNumberIndex);
    this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
