import {Component,EventEmitter, Input, Output} from '@angular/core';
import {Item} from './Item';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  imports: [
    NgClass,

  ],
  styleUrls: ['./item.component.scss']
})
export class ItemComponent {
  @Input() items: Item[] = [];
  @Input() formData!: Item;
  @Output() itemRemoved:  EventEmitter<string> = new EventEmitter<string>();
  @Output() itemIncrease: EventEmitter<string> = new EventEmitter<string>();
  @Output() itemDecrease: EventEmitter<string> = new EventEmitter<string>();
  isRemoving : boolean = false;


  showInfo: boolean = false;
  onDecrease(id:string): void{
    this.itemDecrease.emit(id)
  }
  onIncrease(id:string): void{
    this.itemIncrease.emit(id)
  }
  removeItem(id:string): void{
    this.isRemoving = true;
    setTimeout(()=>{
    this.itemRemoved.emit(id);

    },300)
  }
  toggleInfo(): void{
    this.showInfo = !this.showInfo;
  }


}
