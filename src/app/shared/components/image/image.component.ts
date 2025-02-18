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

  imagePreview: string | null = null;

  constructor(private cacheService: CacheStorageService) {}

  async ngOnInit() {
    if (this.itemId) {
      const item = await this.cacheService.getItem<Item>(this.itemId);
      if (item && item.img) {
        this.imagePreview = item.img;
        this.itemForm.patchValue({ img: item.img });
      }
    }

    this.itemForm.statusChanges.subscribe(status => {
      if (this.itemForm.pristine) {
        this.imagePreview = null;
      }
    });
  }

  onImagePicked(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      if (!file.type.startsWith('image/')) {
        this.itemForm.get('img')?.setErrors({ invalidMimeType: true });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreview = base64String;
        this.itemForm.patchValue({ img: base64String });
        this.itemForm.get('img')?.updateValueAndValidity();
      };
      reader.readAsDataURL(file);
    }
  }

  resetImage(): void {
    this.imagePreview = null;
    this.itemForm.get('img')?.reset();
  }
}
