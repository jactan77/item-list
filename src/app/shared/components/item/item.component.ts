import {Component, EventEmitter, input, Input, OnInit, Output} from '@angular/core';
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
export class ItemComponent implements OnInit{
  @Input() items: Item[] = [];
  @Input() formData!: Item;
  @Output() itemEvent: EventEmitter<{value:string,action:string}> = new EventEmitter<{value:string,action:string}>();
  @Output() newValuesItem: EventEmitter<{id:string,value:number, action:string}> = new EventEmitter<{id:string,value:number, action:string}>();



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
  newAmount(id : string): void{
    this.emitNewValuesItem(id,this.formData.amount,'newAmount');
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
    const value:string = (event.target as HTMLInputElement).value;
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
  onBlurMid(id:string):void{
    if(this.tempMidValue > 0 && this.tempMidValue > this.formData.minValue) {
      this.formData.midValue = this.tempMidValue;
      this.emitNewValuesItem(id, this.formData.midValue, 'onNewMidValue');
      return;
    }

  }
  onBlurMin(id:string): void{
    if(this.tempMinValue > 0 && this.tempMinValue < this.formData.midValue) {
        this.formData.minValue = this.tempMinValue;
        this.emitNewValuesItem(id,this.formData.minValue,'onNewMinValue');
        return;
    }

  }

  isValuesValid(): boolean {

    if (this.tempMinValue <= 0 || this.tempMidValue <= 0) {
      return false;
    }

    if (this.tempMinValue > 0 && this.tempMidValue > 0) {
      return this.tempMidValue > this.tempMinValue;
    }

    const hasInvalidTempMin = this.tempMinValue > 0 && this.tempMinValue >= this.formData.midValue;
    const hasInvalidTempMid = this.tempMidValue > 0 && this.tempMidValue <= this.formData.minValue;

    if (hasInvalidTempMin || hasInvalidTempMid) {
      return false;
    }

    return this.formData.minValue < this.formData.midValue;
  }


  protected readonly input = input;
}
