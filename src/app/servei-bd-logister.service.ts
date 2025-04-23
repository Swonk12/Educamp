import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { usuaris } from './modelsdedades/usuaris';

@Injectable({
  providedIn: 'root'
})
export class ServeiBdLogisterService {

  bdUsuaris = '/usuaris/'

  constructor(
    private bd: AngularFireDatabase
  ) {}

  // Devuelve todos los nombres de usuario
  getUsuaris() {
    return this.bd.list(this.bdUsuaris).valueChanges();
  }

  getUsuariConcret(mail: string) {
    return this.bd.list(this.bdUsuaris +'/'+ mail).valueChanges();
  }

  // Actualiza el estado de un usuario a true cuando hace login
  updateUserStatus(mail: string, Estat: boolean) {
    return this.bd.object(`${this.bdUsuaris}${mail}`).update({ Estat });
  }

  guardarUsuari(mail: string, usuari: any) {
    return this.bd.object(this.bdUsuaris + '/' + mail).set(usuari)
      .then(() => {
        console.log('[SUCCESS] Usuari afegit a la base de dades.');
      })
      .catch((error) => {
        console.error('[ERROR] Error al guardar usuari a Firebase:', error);
      });
  }

  getIdUsuariPerEmail(correu: string): Promise<number | null> {
    return this.bd.database.ref(`usuaris/${correu}`).get().then((snapshot) => {
      const usuari = snapshot.val();
      if (usuari && usuari.id !== undefined) {
        return usuari.id;
      }
      return null;
    });
  }

}
