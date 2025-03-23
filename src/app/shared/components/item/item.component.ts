import {Component, EventEmitter, input, Input, OnInit, Output} from '@angular/core';
import {Item} from './Item';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxSliderModule, Options} from '@angular-slider/ngx-slider';
import {StorageService} from '../../services/storage.service';
import {AmountOperations} from '../../services/AmountOperations';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  imports: [
    NgClass,
    NgIf,
    FormsModule,
    NgxSliderModule

  ],
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit{
  @Input() items: Item[] = [];
  @Input() formData!: Item;
  @Input() userId:string | undefined;
  @Output() removeItem: EventEmitter<{value:string}> = new EventEmitter<{value:string}>();
  @Output() newValuesItem: EventEmitter<{id:string,item:Item,action:AmountOperations}> = new EventEmitter<{id:string,item:Item,action:AmountOperations}>();
  @Output() newColor: EventEmitter<{id:string}> = new EventEmitter<{id:string}>
  sliderOptions:Options={

    floor:0,
    ceil:100,
    minRange:1,
    showOuterSelectionBars: true,

  }


  tempMinValue: number =0;
  tempMidValue: number = 0;



  isRemoving : boolean = false;
  showInfo: boolean = false;
  showEdit: boolean = false;

  constructor(private serviceStorage:StorageService) {}

  ngOnInit() {
    if(this.formData){
      this.tempMinValue = this.formData.minValue;
      this.tempMidValue = this.formData.midValue;
      this.updateSliderOptions();
    }


       this.serviceStorage.amountListener(this.userId, this.formData.id, (data) => {
         if (data) {
          this.formData.amount = parseInt(JSON.stringify(data));

          this.emitNewBackGroundColor(this.formData.id);
        }
         if(data == null){
           this.remove(this.formData.id);
        }
      });

    this.serviceStorage.midValueListener(this.userId, this.formData.id, (data) => {
      if (data) {
        this.formData.midValue = parseInt(JSON.stringify(data));
        this.updateSliderOptions()
        this.emitNewBackGroundColor(this.formData.id);
      }
      if(data == null){
        this.remove(this.formData.id);
      }
    });
    this.serviceStorage.minValueListener(this.userId, this.formData.id, (data) => {
      if (data) {
        this.formData.minValue = parseInt(JSON.stringify(data));
        this.updateSliderOptions()
        this.emitNewBackGroundColor(this.formData.id);
      }
      if(data == null){
        this.remove(this.formData.id);
      }
    });




  }
  updateSliderOptions() {
    if(this.sliderOptions.floor && this.sliderOptions.ceil) {
      this.sliderOptions = {
        ...this.sliderOptions,
        floor: Math.min(this.formData.minValue, this.sliderOptions.floor),
        ceil: Math.max(this.formData.midValue, this.sliderOptions.ceil),
      };
    }
  }

  emitRemoving(value: string) {
    this.removeItem.emit({value});
  }
  emitNewValuesItem(id:string, item:Item,action:AmountOperations){
    this.newValuesItem.emit({id,item,action});
  }
  emitNewBackGroundColor(id:string){
    this.newColor.emit({id});
  }

  remove(id:string): void{
    this.isRemoving = true;
    setTimeout(()=>{
    this.emitRemoving(id);

    },300)
  }
  toggleInfo(): void{
    if(this.showInfo && this.showEdit){
      this.showInfo = !this.showInfo;
      this.showEdit = !this.showEdit;
      return;
    }
    this.showInfo = !this.showInfo;

  }
  changeValues(): void{
    this.showEdit = !this.showEdit;
  }
  onNewValues(id : string,action:AmountOperations): void{
    if(AmountOperations.INCREASE_AMOUNT == action){
      this.formData.amount++;
      this.emitNewBackGroundColor(id);
      this.emitNewValuesItem(id,this.formData,AmountOperations.SET_CURRENT_AMOUNT);
      return;
    }
    if(AmountOperations.DECREASE_AMOUNT == action){
      this.formData.amount--;
      this.emitNewBackGroundColor(id);
      this.emitNewValuesItem(id,this.formData,AmountOperations.SET_CURRENT_AMOUNT);
      return;
    }

      this.emitNewValuesItem(id,this.formData,action);
      this.emitNewBackGroundColor(id);
  }





  protected readonly input = input;
  protected readonly AmountOperations = AmountOperations;
}
