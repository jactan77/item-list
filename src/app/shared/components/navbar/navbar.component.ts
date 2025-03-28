import {Component, inject, Input} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    authService = inject(AuthService);
}
