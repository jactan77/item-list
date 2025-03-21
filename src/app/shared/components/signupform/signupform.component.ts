import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {valuesSignupValidator} from '../../validators/values-signup.validator';
import {CacheStorageService} from '../../services/cache-storage.service';
import {NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-signupform',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './signupform.component.html',
  styleUrl: './signupform.component.scss'
})
export class SignupFormComponent {
    itemForm: FormGroup;
    errorMessage: string;
    constructor(
      private fb:FormBuilder,
      private cacheStorage: CacheStorageService,
      private authService: AuthService,
      private http:HttpClient,
      private router : Router
    ) {

      this.itemForm = this.fb.group({
        userName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: [''],

        },{
        validators:valuesSignupValidator
        }

      )
      this.errorMessage = '';
    }
   async onSubmit(): Promise<void>{
      if(this.itemForm.valid){
          const rawForm = this.itemForm.getRawValue();
           (await this.authService.register(rawForm.email, rawForm.userName, rawForm.password)).subscribe(()=>{
            this.router.navigateByUrl('/login');
          })

      } else {
          if(this.itemForm.errors?.['email']){
              this.errorMessage = 'invalid Email';
          }
      }
    }
}
