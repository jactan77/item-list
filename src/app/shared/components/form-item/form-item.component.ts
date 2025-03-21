import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {Item} from '../item/Item';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {ItemComponent} from '../item/item.component';
import {ImageComponent} from '../image/image.component';
import {NgForOf, NgIf} from '@angular/common';
import {amountValuesValidator} from '../../validators/amount-values.validator';
import {CacheStorageService} from '../../services/cache-storage.service';
import { trigger, style, animate, transition } from '@angular/animations';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import{StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-form-item',
  templateUrl: './form-item.component.html',
  styleUrl: './form-item.component.scss',
  standalone: true,
  imports: [
    ItemComponent,
    ImageComponent,
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    RouterModule
  ],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class FormItemComponent {
  @ViewChild(ImageComponent) imageComponent!: ImageComponent;
  @ViewChild(ItemComponent) itemComponent!: ItemComponent;
  authService : AuthService  = inject(AuthService)

  itemForm: FormGroup;
  formData!: Item;
  errorMessage: string = '';
  items: Item[] = [];


  constructor(
    private fb: FormBuilder,
    private cacheService: CacheStorageService,
    private storageService:StorageService,
    private route: Router
  ) {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      amount: [null, [Validators.required, Validators.min(1)]],
      minValue: [null, [Validators.required, Validators.min(1)]],
      midValue: [null, [Validators.required, Validators.min(1)]],
      id: [''],
      img:[null]
    }, {
      validators: amountValuesValidator
    });
  }


  async ngOnInit() {
    this.items = await this.loadItems();
    this.authService.user$.subscribe((user)=>{
      if(user){
        this.authService.currentUserSig.set({
            email: user.email!,
            username: user.displayName!,
            id:user.uid
          }
        );
      }else{
        this.route.navigateByUrl('/login');
      }
    })

  }

  async loadItems(): Promise<Item[]> {
    const userData = await this.storageService.loadItems(this.authService.currentUserSig()?.id);
    if (!userData) return [];
    return Object.entries(userData).map(([id, obj]) => {
      const parsedItem = JSON.parse(obj.item);
      return {
        id,
        ...parsedItem
      };
    });
  }

  async onSubmit() {
    if (this.itemForm.valid) {
      const newItem: Item = {
        ...this.itemForm.value,
        id: Math.floor(Math.random() * 1000).toString(),
        color: "border-green"
      };
      if (this.itemForm.get('img')?.value) {
        newItem.img = this.itemForm.get('img')?.value;
      }

      await this.cacheService.setItem(newItem.id, newItem);
      if(this.authService.currentUserSig()?.id){
        await this.storageService.addItem(this.authService.currentUserSig()?.id,newItem.id,newItem);

      }
      this.items.push(newItem);
      this.formData = newItem;
      this.itemForm.reset();
      this.imageComponent.resetImage();
    } else {
      if (this.itemForm.errors?.['invalidNumbers']) {
        this.errorMessage = 'Invalid input. Please enter positive numbers for Amount and values.';
      } else if (this.itemForm.errors?.['invalidRange']) {
        this.errorMessage = 'Invalid input. Please enter valid Amount and values.';
      }
    }
  }

  async onEventItem(event: {value: string, action: string}): Promise<void> {
    const item: Item | undefined = this.items.find(item => item.id === event.value);

    switch (event.action) {
      case 'removeItem': {
        this.items = this.items.filter(item => item.id !== event.value);
        await this.cacheService.removeItem(event.value);
        await this.storageService.removeItem(this.authService.currentUserSig()?.id,event.value);
        break;
      }
      case 'onDecrease': {
        if (item && item.amount > 0) {
          item.amount--;
          this.toggleBackground(event.value);
          await this.cacheService.setItem(event.value, item);
          await this.storageService.addItem(this.authService.currentUserSig()?.id,event.value,item);
        }
        break;
      }
      case 'onIncrease': {
        if (item) {
          item.amount++;
          this.toggleBackground(event.value);
          await this.cacheService.setItem(event.value, item);
          await this.storageService.addItem(this.authService.currentUserSig()?.id,event.value,item);
        }
        break;
      }
      default: {
        console.error("Invalid request");
      }
    }
  }
  async onNewValuesEvent(event: {id:string,item:Item}):Promise<void> {
    const item: Item | undefined = this.items.find(item => item.id === event.id);
    if(item){
      await this.cacheService.setItem(event.id,event.item);
      await this.storageService.addItem(this.authService.currentUserSig()?.id,event.id,item);
      this.toggleBackground(event.id);
    }
  }

  toggleBackground(id: string): void {
    const item:Item | undefined = this.items.find(item => item.id === id);
    if (!item) return;

    const {amount, midValue, minValue} = item;
    item.color = amount > midValue
      ? 'border-green'
      : amount > minValue
        ? 'border-yellow'
        : 'border-red';
  }
}
