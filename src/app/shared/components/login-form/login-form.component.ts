import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,

  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
    loginForm: FormGroup;
    errorMessage: string | null = '';
    constructor(private fb: FormBuilder, private authService: AuthService, private router:Router, private http:HttpClient) {
      this.loginForm = this.fb.group({
        email:'',
        password: ''
      })
    }
    onSubmit(){
      const form = this.loginForm.getRawValue();
      this.authService
        .login(form.email,form.password)
        .subscribe({
          next:()=>{
            this.router.navigateByUrl('/home').then(r => {})
          },
        error:(err)=>{
            this.errorMessage = err.code;
        }})
    }

}
