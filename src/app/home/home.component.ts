import { Component } from '@angular/core';
import { ServeiAutenticarService } from '../servei-autenticar.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  selectedButton: string = 'inscrits';

  constructor(public serveiAutenticar: ServeiAutenticarService) { }

  ngOnInit(): void {
    this.serveiAutenticar.loginOK=false;
    console.log("Estas Home")
  }

  select(button: string): void {
    this.selectedButton = button;
  }

  logout() {
    this.serveiAutenticar.logout();
  }

}
