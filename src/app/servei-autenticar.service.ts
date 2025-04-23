import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ServeiBdLogisterService } from './servei-bd-logister.service';
import firebase from "@firebase/app-compat" // --- versió 8.16
import 'firebase/compat/auth';
import {Observable, from, firstValueFrom, Subject} from 'rxjs';  // Importamos 'from' de 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

// hem afegit aquest import a la versió 23-24
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class ServeiAutenticarService {
  private firebaseUrl = 'https://educamp-a1a30-default-rtdb.firebaseio.com/usuaris.json';
  errorPopup$ = new Subject<{ message: string, isSuccess: boolean }>();
  loginOK = false;
  usuari: any;

  email = '';
  mailGenrico = '';
  psw = '';
  rol = 0;
  nomUser = '';
  userName = '';

  creat: boolean = false; // Per trencar el bucle d'afegir usuari

  constructor(
    public auth: AngularFireAuth,
    private serveiBdLogister: ServeiBdLogisterService,
    private http: HttpClient,
    private router: Router,
  ) { }

  triggerError(message: string, isSuccess: boolean = false) {
    this.errorPopup$.next({ message, isSuccess });
  }

  getuser() {
    return this.auth.authState;
  }

  getUsuariActual() {
    return this.nomUser;
  }

  isAdmin(): boolean {
    return this.rol == 1;
  }

  isAlumne(): boolean {
    return this.rol == 2;
  }

  isTeacher(): boolean {
    return this.rol == 3;
  }


  googleLogin() {
    signInWithPopup(getAuth(), new firebase.auth.GoogleAuthProvider())
      .then((result) => {
        const credencial = GoogleAuthProvider.credentialFromResult(result);
        const token = credencial?.accessToken;

        this.usuari = result.user;
        this.email = this.usuari.email;

        // Asignar Username y NomComplet si no existen (usando displayName o el email como fallback)
        if (!this.usuari.Username) {
          this.usuari.Username = this.usuari.displayName || this.email;
        }
        if (!this.usuari.NomComplet) {
          this.usuari.NomComplet = this.usuari.displayName || this.email;
        }

        const mailClean = quitarArrovaPunto(this.email);

        // Verificar si el usuario ya existe en la base de datos.
        this.serveiBdLogister.getUsuariConcret(mailClean).subscribe({
          next: (usuari: any) => {
            if (usuari && Object.keys(usuari).length > 0) {
              // Usuario existente: iniciamos sesión y redirigimos a home.
              this.loginOK = true;
              this.mailGenrico = this.email;
              this.rol = usuari[3]; // Assigna el rol

              // Desar el rol a localStorage després del login
              localStorage.setItem('rol', this.rol.toString()); // Guardem el rol a localStorage

              this.router.navigate(['/home']);
            } else {
              // Usuario no existente: procedemos a registrarlo.
              this.afegirUsuari(this.usuari).subscribe({
                next: (res: any) => {
                  this.loginOK = true;
                  this.router.navigate(['/home']);
                },
                error: (error: any) => {
                  // Manejo de error al registrar el usuario.
                },
                complete: () => {
                  // Lógica adicional cuando la suscripción se complete, si es necesario.
                }
              });
            }
          },
          error: (error: any) => {
            // Manejo de error al obtener el usuario.
          }
        });
      })
      .catch((error) => {
        this.loginOK = false;
        // Manejo de error en el proceso de Google login.
      });
  }

  login() {
    this.auth.signInWithEmailAndPassword(this.email, this.psw).then((userCredential) => {
      const user = userCredential.user;
      if (user) {
        if (!user.emailVerified) {
          console.log('El correu no està verificat. Si us plau, verifica el teu compte abans d’iniciar sessió.');
          this.triggerError('Cuenta no verificada. Revisa la bandeja de entrada', false);
          this.loginOK = false;
          return;
        }

        let mailClean = quitarArrovaPunto(this.email);
        this.serveiBdLogister.getUsuariConcret(mailClean).subscribe((usuari: any) => {
          if (usuari[7] == this.email) {
            console.log('Usuari verificat i loguejat:', usuari[7]); // Mostra el correu loguejat
            this.loginOK = true;
            this.mailGenrico = this.email;
            this.rol = usuari[3]; // Assigna el rol
            this.nomUser = usuari[5]; // Assigna el nom d'usuari
            this.userName = usuari[6]; // Assigna el nom complet

            // Desar el rol a localStorage després del login
            localStorage.setItem('rol', this.rol.toString()); // Guardem el rol a localStorage

            // Actualitza l'estat de l'usuari a true
            this.serveiBdLogister.updateUserStatus(mailClean, true)
              .then(() => {
                console.log('Estat actualitzat correctament');
                this.router.navigate(['/home']);
              })
              .catch(error => console.error('Error en actualitzar estat:', error));
          } else {
            console.log('No has pogut iniciar sessió');
          }
        });
      }
    })
    .catch((error) => {
      this.triggerError('Error al iniciar sesion', false);
      this.loginOK = false;
    });
  }

  // logout
  logout() {
    console.log('Hem tancat la sessió - here');

    let mailClean = quitarArrovaPunto(this.mailGenrico);
    console.log('Email limpio:', mailClean);

    this.serveiBdLogister.updateUserStatus(mailClean, false)
      .then(() => {
        console.log('Estado actualizado a false correctamente');
        // Solo ahora cerramos sesión
        this.auth.signOut().then(() => {
          this.usuari = null;
          this.loginOK = false;
          this.email = '';
          this.psw = '';
          window.location.href = '/';
        });
      })
      .catch(error => console.error('Error al actualizar estado:', error));
  }

  afegirUsuari(usuari: any): Observable<any> {
    const mailClean = quitarArrovaPunto(usuari.email);

    return new Observable(observer => {
      (async () => {
        try {
          // Obtenim els usuaris existents esperant que finalitzi
          const usuaris: any[] = await firstValueFrom(this.serveiBdLogister.getUsuaris());
          let maxId = 0;
          let usuariExisteix = false;

          for (const u of usuaris) {
            // Obtenir l'últim Id de la base de dades
            if (u.IdUsuari > maxId) {
              maxId = u.IdUsuari;
            }

            if (u.email === usuari.email || u.Username === usuari.Username || u.NomComplet === usuari.NomComplet) {
              console.log(`Usuari ja existent detectat: ${u.email} | ${u.Username} | ${u.NomComplet}`);
              usuariExisteix = true;
              observer.error("L'usuari ja existeix amb aquest email, username o nom.");
              observer.complete();
              return;
            }
          }

          if (!usuariExisteix) {
            // Registrar l'usuari a Firebase Authentication
            const userCredential = await this.auth.createUserWithEmailAndPassword(usuari.email, usuari.Contrasenya);

            // Enviar correu de verificació
            await userCredential.user?.sendEmailVerification();

            // Si l'usuari no existeix a la base, assignem ID i creem l'usuari
            usuari.IdUsuari = maxId + 1;
            const usuariFirebase = {
              [mailClean]: {
                Contrasenya: usuari.Contrasenya,
                DataInscripció: usuari.DataInscripció,
                Estat: usuari.Estat,
                IdRol: usuari.IdRol,
                IdUsuari: usuari.IdUsuari,
                NomComplet: usuari.NomComplet,
                Username: usuari.Username,
                email: usuari.email,
              }
            };

            // Afegim l'usuari a Firebase
            const res = await firstValueFrom(this.http.patch(this.firebaseUrl, usuariFirebase));
            console.log('Usuari afegit correctament', res);
            observer.next("Usuari registrat correctament! Si us plau, revisa el teu correu per verificar el compte.");
            observer.complete();
          }
        } catch (err) {
          console.error('Error en afegir usuari', err);
          observer.error("Error al guardar l'usuari: " + err);
          observer.complete();
        }
      })();
    });
  }
}

function quitarArrovaPunto(email: string) {
  var emailClean = email.replace(/[@.]/g, "");
  console.log("emailClean", emailClean);
  return emailClean;
}
