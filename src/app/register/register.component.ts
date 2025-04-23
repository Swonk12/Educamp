import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServeiAutenticarService } from '../servei-autenticar.service';
import { ApiService } from '../services/api.service'; //

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css', 'register.component.css']
})

export class RegisterComponent {
  showError: boolean = false;
  isSuccess: boolean = false;
  errorMessage: string = "";
  ContrasenyaConfirmada: string = '';

  passwordFieldType: string = 'password';         // es necessari dir que esta en password sino la contrassenya quan s'escrigui es veura directament
  confirmPasswordFieldType: string = 'password';  //es necessari dir que esta en password sino la contrassenya quan s'escrigui es veura directament

  usuari = {
    Contrasenya: '',
    DataInscripció: new Date().toLocaleDateString(),
    Estat: false,
    IdRol: 2, // Per defecte, rol d'alumne
    NomComplet: '',
    Username: '',
    email: '',
  };

  constructor(private serveiAutenticar: ServeiAutenticarService, private router: Router, private apiService: ApiService) {}

  onRegister() {

    if (!this.usuari.email || !this.usuari.Contrasenya || !this.usuari.Username || !this.usuari.NomComplet || !this.ContrasenyaConfirmada) {
      this.showErrorPopup('Todos los campos son obligatorios');
      return;
    }

    if(this.usuari.Contrasenya !== this.ContrasenyaConfirmada){
      this.showErrorPopup('Las contraseñas no coinciden');
      return;
    }

    // Expressió regular per validar la contrasenya
    const contrasenyaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!contrasenyaRegex.test(this.usuari.Contrasenya)) {
      this.showErrorPopup("La contrasenya ha de tenir almenys 8 caràcters, 1 minúscula, 1 majúscula i 1 símbol.");
      return;
    }

    // Comprovar si l'email introduit té una expressió regular per validar el format del correu electrònic
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const email = this.usuari.email.toLowerCase();

    if (!emailRegex.test(email)) {
      this.showErrorPopup("El correo electronico no tiene un formato valido");
      return;
    }

    this.serveiAutenticar.afegirUsuari(this.usuari).subscribe({
      next: (res) => {
        console.log('Usuario registrado correctamente', res);
        var url = "https://gameverse.aquero.es"
        this.apiService.sendVerification(this.usuari.email, this.usuari.Username, url).subscribe();
        this.showErrorPopup("Usuario registrado correctamente!", true);  // true para indicar que es éxito
        this.resetForm();
      },
      error: (err) => {
        console.error('Error en registrar un usuario', err);
        this.showErrorPopup(err); // Error sigue siendo false
        this.resetForm();
      }
    });
  }

  // Mètode per restablir el formulari després d'un registre correcte
  resetForm() {
    this.usuari = {
      Contrasenya: '',
      DataInscripció: new Date().toLocaleDateString(),
      Estat: false,
      IdRol: 2, // Per defecte, rol d'alumne
      NomComplet: '',
      Username: '',
      email: '',
    };
    this.ContrasenyaConfirmada = ''; // Resetejar la contrasenya confirmada
  }

  showErrorPopup(message: string, isSuccess: boolean = false) {
    this.errorMessage = message;
    this.showError = true;
    this.isSuccess = isSuccess;
  }

  closePopup() {
    this.showError = false;
  }

  togglePassword(field: 'password' | 'password2') {
    if (field === 'password') {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
    } else if (field === 'password2') {
      this.confirmPasswordFieldType = this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
    }
  }
}
