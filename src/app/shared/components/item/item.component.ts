import {Component, EventEmitter, input, Input, OnInit, Output} from '@angular/core';
import {Item} from './Item';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgxSliderModule, Options} from '@angular-slider/ngx-slider';
import {min} from 'rxjs';

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
  @Output() itemEvent: EventEmitter<{value:string,action:string}> = new EventEmitter<{value:string,action:string}>();
  @Output() newValuesItem: EventEmitter<{id:string,item:Item}> = new EventEmitter<{id:string,item:Item}>();

  sliderOptions:Options={
    floor:0,
    ceil:100,
    minRange:1,
    showOuterSelectionBars: true

  }


  tempMinValue: number =0;
  tempMidValue: number = 0;



  isRemoving : boolean = false;
  showInfo: boolean = false;
  showEdit: boolean = false;

  ngOnInit() {
    if(this.formData){
      this.tempMinValue = this.formData.minValue;
      this.tempMidValue = this.formData.midValue;
    }
  }

  emitEvent(value: string, action: string) {
    this.itemEvent.emit({value, action});
  }
  emitNewValuesItem(id:string, item:Item){
    this.newValuesItem.emit({id,item});
  }

  removeItem(id:string): void{
    this.isRemoving = true;
    setTimeout(()=>{
    this.emitEvent(id,'removeItem');

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
  onNewValues(id : string): void{
    this.emitNewValuesItem(id,this.formData);
  }
  onDecrease(id:string): void{
    this.emitEvent(id,'onDecrease');
  }
  onIncrease(id:string): void{
    this.emitEvent(id,'onIncrease');
  }




  protected readonly input = input;
  protected readonly min = min;
}
