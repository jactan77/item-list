import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CacheStorageService } from '../../services/cache-storage.service';
import { Item } from '../item/Item';
import {NgIf} from '@angular/common';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  standalone: true,
  imports: [
    NgIf,

  ],
  styleUrl: './image.component.scss'
})
export class ImageComponent {
  @Input() itemForm!: FormGroup;
  @Input() itemId?: string;
  selectedFile: File | null = null;
  URL: string | ArrayBuffer | null = null;



  onImagePicked(event: any): void {

if(event.target.files && event.target.files[0]){
  this.selectedFile = event.target.files[0];
  if (this.selectedFile) {
      if (!this.selectedFile.type.startsWith('image/')) {
        this.itemForm.get('img')?.setErrors({ invalidMimeType: true });
        return;
      }

      const reader = new FileReader();
      reader.onload = () :void => {
        this.URL=reader.result;
        this.itemForm.patchValue({ img: this.URL as string });
        this.itemForm.get('img')?.updateValueAndValidity();

      };
      reader.readAsDataURL(this.selectedFile);

    }
  } else
      this.resetImage();

  }

  resetImage(): void {
    this.URL = null;
    this.itemForm.get('img')?.reset();
    this.selectedFile = null;
  }

}
