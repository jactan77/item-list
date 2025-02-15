import {Component} from '@angular/core';
import {ThemeService} from '../../services/theme.service';
import {Observable} from 'rxjs';
@Component({
  standalone:true,
  selector:'app-theme-toggle',
  templateUrl:'theme-toggle.component.html',
  styleUrl:'theme-toggle.component.scss'
})
export class ThemeToggleComponent {
  isChanging = false;
  isDarkMode$: Observable<boolean>;
  constructor(private themeService: ThemeService) {
    this.isDarkMode$ = this.themeService.darkMode$;
  }
  toggleTheme(){
    this.isChanging = !this.isChanging;

  }


}
