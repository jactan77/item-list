import {Component, OnInit, ViewChild} from '@angular/core';
import { Item } from './shared/components/item/Item';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItemComponent } from './shared/components/item/item.component';
import {ImageComponent} from './shared/components/image/image.component';
import {NgForOf, NgIf} from '@angular/common';
import {amountValuesValidator} from './shared/validators/amount-values.validator';
import {CacheStorageService} from './shared/services/cache-storage.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    ItemComponent,
    ImageComponent,
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
export class AppComponent implements OnInit {
  @ViewChild(ImageComponent) imageComponent!: ImageComponent;
  @ViewChild(ItemComponent) itemComponent!: ItemComponent;
  itemForm: FormGroup;
  formData!: Item;
  errorMessage: string = '';
  items: Item[] = [];


  constructor(
    private fb: FormBuilder,
    private cacheService: CacheStorageService
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
  }

  async loadItems(): Promise<Item[]> {
    const keys = await this.cacheService.getAllKeys();
    const items: Item[] = [];

    for (const key of keys) {
      const item = await this.cacheService.getItem<Item>(key);
      if (item !== null) {
        items.push(item);
      }
    }

    return items;
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
        break;
      }
      case 'onDecrease': {
        if (item && item.amount > 0) {
          item.amount--;
          this.toggleBackground(event.value);
          await this.cacheService.setItem(event.value, item);
        }
        break;
      }
      case 'onIncrease': {
        if (item) {
          item.amount++;
          this.toggleBackground(event.value);
          await this.cacheService.setItem(event.value, item);
        }
        break;
      }
      case 'onMidValueDecrease': {
        if ((item && item.midValue > 0) && (item.midValue > item.minValue + 1)) {
          item.midValue--;
          this.toggleBackground(event.value);
          await this.cacheService.setItem(event.value, item);
        }
        break;
      }
      case 'onMidValueIncrease': {
        if (item) {
          item.midValue++;
          this.toggleBackground(event.value);
          await this.cacheService.setItem(event.value, item);
        }
        break;
      }
      case 'onMinValueDecrease': {
        if (item && item.minValue > 1) {
          item.minValue--;
          this.toggleBackground(event.value);
          await this.cacheService.setItem(event.value, item);
        }
        break;
      }
      case 'onMinValueIncrease': {
        if (item && item.minValue < item.midValue - 1) {
          item.minValue++;
          this.toggleBackground(event.value);
          await this.cacheService.setItem(event.value, item);
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
