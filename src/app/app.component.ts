import {Component, OnInit} from '@angular/core';
import { Item } from './shared/components/item/Item';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemComponent } from './shared/components/item/item.component';
import {NgForOf, NgIf} from '@angular/common';
import {amountValuesValidator} from './shared/validators/amount-values.validator';
import {LocalStorageService} from './shared/services/local-storage.service';
import { trigger, style, animate, transition } from '@angular/animations';
import {ThemeService} from './shared/services/theme.service';
import {Observable} from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    ItemComponent,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit{
  itemForm: FormGroup;
  formData!: Item;
  errorMessage: string = '';
  items : Item[] = [];
  isDarkMode$: Observable<boolean>;

  constructor(private fb: FormBuilder,private localStorageService:LocalStorageService, private themeService:ThemeService) {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      amount: [null, [Validators.required, Validators.min(1)]],
      minValue: [null, [Validators.required, Validators.min(0)]],
      midValue: [null, [Validators.required, Validators.min(0)]],
      id: ['']

    },{
      validators: amountValuesValidator
    });
    this.isDarkMode$= this.themeService.darkMode$;
  }


  ngOnInit() {
      this.items = this.loadItems();
  }

  loadItems(): Item[]{
    const keys: string[] = Object.keys(localStorage);
    return  keys
      .map(key => this.localStorageService.getItem<Item>(key))
      .filter((itemData): itemData is Item => itemData !== null);
  }
  onSubmit() {
    if (this.itemForm.valid) {
      const newItem: Item = {
        ...this.itemForm.value,
        id: Math.floor(Math.random() * 1000).toString(),
        color:"bg-success"
      };

      this.localStorageService.setItem(newItem.id,newItem);
      this.items.push(newItem);
      this.formData = newItem;
      this.itemForm.reset();
    } else {
      if (this.itemForm.errors?.['invalidNumbers']) {
        this.errorMessage = 'Invalid input. Please enter positive numbers for Amount and values.';
      } else if (this.itemForm.errors?.['invalidRange']) {
        this.errorMessage = 'Invalid input. Please enter valid Amount and values.';
      }
    }
  }

  onEventItem(event:{value:string,action:string }): void{
      const item: Item | undefined = this.items.find(item => item.id === event.value);
      switch (event.action){
        case 'removeItem': {
          this.items = this.items.filter(item => item.id !== event.value);
          this.localStorageService.removeItem(event.value);
          break;
        }
        case 'onDecrease':{
          if( item && item?.amount > 0) {
            item.amount--;
            this.toggleBackground(event.value);
            this.localStorageService.setItem(event.value,item);

          }
          break;
        }
        case 'onIncrease':{
          if(item) {
            item.amount++;
            this.toggleBackground(event.value);
            this.localStorageService.setItem(event.value,item);
          }
          break;
        }
        case 'onMidValueDecrease':{
          if((item && item?.midValue > 0) &&  (item?.midValue > item?.minValue+1)){
            item.midValue--;
            this.toggleBackground(event.value);
            this.localStorageService.setItem(event.value,item);
          }
          break;
        }
        case 'onMidValueIncrease':{
          if(item){
            item.midValue++;
            this.toggleBackground(event.value);
            this.localStorageService.setItem(event.value,item);
          }
          break;
        }
        case 'onMinValueDecrease':{
          if( item &&  (item?.minValue > 0)){
            item.minValue--;
            this.toggleBackground(event.value);
            this.localStorageService.setItem(event.value,item);
          }
          break;
        }
        case 'onMinValueIncrease':{
          if( item &&  (item?.minValue < item?.midValue-1)){
            item.minValue++;
            this.toggleBackground(event.value);
            this.localStorageService.setItem(event.value,item);
          }
          break;
        }
        default:{
          console.error("Invalid request");
        }
      }
  }
  toggleBackground(id:string):void{
    const item = this.items.find(item => item.id === id);
    if(!item) return;
    const {amount,midValue, minValue} = item;
    item.color =
          amount > midValue
          ? 'bg-success'
          : amount > minValue
          ? 'bg-warning'
          : 'bg-danger';
  }




}

