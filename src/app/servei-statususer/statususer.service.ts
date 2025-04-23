import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getDatabase, ref, child, get } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class StatususerService {
  constructor(private firestore: Firestore) {}

  // Método para obtener usuarios activos desde Realtime Database
  getActiveUsers(): Observable<any[]> {
    const db = getDatabase();  // Inicializamos la base de datos
    const usersRef = ref(db, 'usuaris');  // Referencia al nodo 'usuaris'

    // Usamos `get()` para obtener los datos del nodo 'usuaris'
    return from(get(usersRef)).pipe(
      map(snapshot => {
        const users = snapshot.val();  // Obtenemos los datos de los usuarios en forma de objeto
        if (users) {
          // Filtramos los usuarios activos, aquellos cuyo campo 'Estat' es 'true'
          const activeUsers = Object.keys(users)
            .filter(key => users[key].Estat === true)  // Comprobamos si el usuario está activo
            .map(key => users[key]);  // Mapeamos los datos de los usuarios activos
          return activeUsers;
        } else {
          return [];  // Si no hay usuarios, retornamos un array vacío
        }
      })
    );
  }
}