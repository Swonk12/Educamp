import {Component, ViewEncapsulation} from '@angular/core';
import { ServeiAutenticarService } from '../servei-autenticar.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  passwordFieldType: string = 'password'; // es necessari dir que esta en password sino la contrassenya quan s'escrigui es veura directament

  constructor(public serveiAutenticar: ServeiAutenticarService) { }

  ngOnInit(): void {
    this.serveiAutenticar.loginOK = false;
    this.serveiAutenticar.errorPopup$.subscribe(({ message, isSuccess }) => {
      this.showErrorPopup(message, isSuccess);
    });
  }

  googleLogin() {
    this.serveiAutenticar.googleLogin()
  }

  logout() {
    this.serveiAutenticar.logout()
  }

  login() {
    this.serveiAutenticar.login();
  }

  // mostra o oculta la contrassenya si apretem el botó
  togglePassword() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  showError = false;
  errorMessage = '';
  isSuccess = false;

  showErrorPopup(msg: string, success: boolean = false) {
    this.errorMessage = msg;
    this.isSuccess = success;
    this.showError = true;
  }

  closePopup() {
    this.showError = false;
  }

}
