import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(private readonly _router : Router){ }

  @Input() items ! : any;
  @Output() recipeSelected : EventEmitter<number> = new EventEmitter();

  selectedMenu ! : {title:string,description:string,price:number,imageUrl:string}[];

  form! : FormGroup;

  ngOnInit() {
    this.form = new FormGroup({
      name : new FormControl("",Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(10)
      ])),
      email : new FormControl(),
      recipe : new FormArray([]),
      bill : new FormControl(0)
    });
  }

  navigateToLogin(){
    this._router.navigate(["login"],{queryParams:{lastname:'Maret',firstname:"Gabriel"}})
  }

  chooseMenu(chosenMenu:string){
    this.selectedMenu = this.items.data.find((e:any) => e.title === chosenMenu).recipes;
    console.log("data=",this.items.data);
  }

  addRecipe(name:string){
    const recipesList = this.form.get("recipe") as FormArray;
    const bill = this.form.get("bill") as FormControl;

    const elem = this.selectedMenu.find(e => e.title === name);
    let price = 0;
    if(elem)
      price = elem.price;

    // If the recipe already exists
    let i = recipesList.value.findIndex((e:any) => e.name === name);
    if(i >= 0){
      const elemToIncrease = recipesList.at(i);
      const quantity = elemToIncrease.value.quantity;
      elemToIncrease.patchValue({
        quantity : quantity + 1
      });
    }else{
      // else (the recipe must be added)
      const group = new FormGroup({
        name : new FormControl(name,Validators.required),
        quantity : new FormControl(1,Validators.compose([
          Validators.required,
          Validators.min(1)])),
        price : new FormControl(price)
      })
      recipesList.push(group);
    };

    bill.patchValue(
      bill.value + recipesList.at(i).value.price
    )
    this.recipeSelected.emit(bill.value);
  }
}
