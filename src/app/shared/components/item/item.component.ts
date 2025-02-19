import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from './Item';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  imports: [
    NgClass,
    NgIf,
    FormsModule,

  ],
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input() items: Item[] = [];
  @Input() formData!: Item;
  @Output() itemEvent: EventEmitter<{value:string,action:string}> = new EventEmitter<{value:string,action:string}>();
  @Output() newValuesItem: EventEmitter<{id:string,value:number, action:string}> = new EventEmitter<{id:string,value:number, action:string}>();



  tempMinValue: number =0;
  tempMidValue: number = 0;

  updateMinValue: number = 0;
  updateMidValue:number = 0;

  isRemoving : boolean = false;
  showInfo: boolean = false;
  showEdit: boolean = false;

  emitEvent(value: string, action: string) {
    this.itemEvent.emit({value, action});
  }
  emitNewValuesItem(id:string, value: number, action: string){
    this.newValuesItem.emit({id,value,action});
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
  onDecrease(id:string): void{
    this.emitEvent(id,'onDecrease');
  }
  onIncrease(id:string): void{
    this.emitEvent(id,'onIncrease');
  }

  onMidValueDecrease(id:string):void{
        this.emitEvent(id,'onMidValueDecrease');
  }
  onMidIncrease(id:string):void{
    this.emitEvent(id,'onMidValueIncrease');

  }
  onMinDecrease(id:string):void{
    this.emitEvent(id,'onMinValueDecrease');
  }
  onMinIncrease(id:string):void{
    this.emitEvent(id,'onMinValueIncrease');
  }

  onNewMidValue(event: Event | null): void {
  if(event && event.target) {
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      this.tempMidValue = parseInt(value);
    }
  }
  }

  onNewMinValue(event: Event | null): void {
    if(event && event.target) {
      const value = (event.target as HTMLInputElement).value;
      if (value) {
        this.tempMinValue = parseInt(value);
      }
    }
  }
  onBlurMid(id:string){
    if(this.tempMidValue > 0) {
      this.formData.midValue = this.tempMidValue;
    }
      this.emitNewValuesItem(id, this.formData.midValue, 'onNewMidValue');

  }
  onBlurMin(id:string){
  if(this.tempMinValue > 0) {
    this.formData.minValue = this.tempMinValue;
  }
    this.emitNewValuesItem(id,this.formData.minValue,'onNewMinValue');
  }
  isValuesValid():boolean{
    return this.formData.midValue > this.formData.minValue && (this.formData.midValue > 0 && this.formData.minValue>0);
  }


  protected readonly HTMLInputElement = HTMLInputElement;
}
