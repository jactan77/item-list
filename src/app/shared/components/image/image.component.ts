import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CacheStorageService } from '../../services/cache-storage.service';
import { Item } from '../item/Item';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  standalone: true,
  imports: [
    NgIf
  ],
  styleUrl: './image.component.scss'
})
export class ImageComponent implements OnInit {
  @Input() itemForm!: FormGroup;
  @Input() itemId?: string;
  selectedFile: File | null = null;
  URL: string | ArrayBuffer | null = null;

  constructor(private cacheService: CacheStorageService) {}

  async ngOnInit() : Promise<void> {
    if (this.itemId) {
      const item : Item | null = await this.cacheService.getItem<Item>(this.itemId);
      if (item && item.img) {
        this.URL = item.img;
        this.itemForm.patchValue({ img: item.img });
      }
    }
  }

  onImagePicked(event: any): void {

if(event.target.files && event.target.files[0]){
  this.selectedFile = event.target.files[0];
  if (this.selectedFile) {
      if (!this.selectedFile.type.startsWith('image/')) {
        this.itemForm.get('img')?.setErrors({ invalidMimeType: true });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e:Event) :void => {
        this.URL=reader.result;
        this.itemForm.patchValue({ img: this.URL as string });
        this.itemForm.get('img')?.updateValueAndValidity();

      };
      reader.readAsDataURL(this.selectedFile);

    }
  }
  }

  resetImage(): void {
    this.URL = null;
    this.itemForm.get('img')?.reset();
  }
}
