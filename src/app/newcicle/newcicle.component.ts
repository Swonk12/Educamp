import { Component, EventEmitter, Output } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
//import { v4 as uuidv4 } from 'uuid'; // Importamos la función uuidv4 para generar IDs únicos

@Component({
  selector: 'app-newcicle',
  templateUrl: './newcicle.component.html',
  styleUrls: ['./newcicle.component.css']
})
export class NewcicleComponent {
  @Output() close = new EventEmitter<void>();

  nom: string = '';
  abreviatura: string = '';
  errorMsg: string = '';
  successMsg: string = '';

  constructor(private db: AngularFireDatabase) {}

  closeModal() {
    this.close.emit();
  }

  guardarCiclo() {
    if (!this.nom || !this.abreviatura) {
      this.errorMsg = 'Rellena todos los campos.';
      return;
    }
  
    this.db.object('cicles').query.once('value')
      .then(snapshot => {
        const data = snapshot.val();
        let maxId = 0;
  
        // Recorremos todos los ciclos
        for (const key in data) {
          const ciclo = data[key];
          let id = ciclo.IdCicle;
  
          // Aseguramos que sea un n�mero (si es string, lo convertimos; si es UUID, se ignora)
          const idNum = parseInt(id, 10);
          if (!isNaN(idNum) && idNum > maxId) {
            maxId = idNum;
          }
        }
  
        const newId = maxId + 1;
  
        const cicloData = {
          IdCicle: newId,
          Nom: this.nom // usa "Nom" para unificar
        };
  
        return this.db.object(`cicles/${this.abreviatura}`).set(cicloData);
      })
      .then(() => {
        this.successMsg = 'Ciclo guardado correctamente.';
        this.nom = '';
        this.abreviatura = '';
        setTimeout(() => this.closeModal(), 1500);
      })
      .catch(err => {
        this.errorMsg = 'Error al guardar el ciclo: ' + err.message;
      });
  }  
}