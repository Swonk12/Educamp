import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


// Tipus de les dades de l'usuari (pots afegir més atributs si cal)
interface Usuari {
  Contrasenya: string;
  DataInscripció: string;
  Estat: boolean;
  IdRol: string;
  IdUsuari: number;
  NomComplet: string;
  Username: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class ListopicService {
  private modulesPath = '/moduls'; // Ruta en la base de datos
  private ciclesPath = '/cicles'; // Ruta en la base de datos
  private usuarisPath = '/usuaris'; // Ruta en la base de datos

  constructor(private db: AngularFireDatabase) {}

  getModules(): Observable<any[]> {
    return this.db.list(this.modulesPath).snapshotChanges().pipe(
      map((changes) =>
        changes.map((c) => ({
          key: c.payload.key, // La clave del módulo
          ...(c.payload.val() || {}), // Asegurar que no sea null
        }))
      )
    );
  }

  // Obtener ciclos desde Firebase
  getCicles(): Observable<any[]> {
    return this.db.object(this.ciclesPath).valueChanges().pipe(
      map((data: any) => {
        if (!data) return []; // Si no hay datos, retornamos un array vacío
  
        return Object.keys(data).map(key => ({
          nombreTabla: key, // Guardamos la clave ("AIF", "ASIX", etc.)
          idCicles: data[key].IdCicle, // Extraemos IdCicle
          nombreCicle: data[key].Nom, // Extraemos Nom
          nomProfesor: data[key].nomProfesor // Extraemos nomProfessor
        }));
      })
    );
  }

  getUsuaris(): Observable<any[]> {
    return this.db
      .object(this.usuarisPath)
      .snapshotChanges()
      .pipe(
        map((changes: any) => {
          // Verificamos si changes es un array o un objeto
          const data = changes.payload.val();
          if (!data) {
            return []; // Si no hay datos, devolvemos un array vacío
          }
  
          // Si es un objeto, convertimos sus claves a un array de usuarios
          return Object.keys(data).map(key => {
            const usuari = data[key];
            return { key, ...usuari }; // Añadimos la clave como campo adicional
          });
        })
      );
  }

  // Funció per obtenir un usuari per Username
  getUsuariPerUsername(username: string): Observable<Usuari | undefined> {
    return this.getUsuaris().pipe(
      map(usuaris => usuaris.find(usuari => usuari.Username === username)) // Busquem l'usuari per Username
    );
  }
}