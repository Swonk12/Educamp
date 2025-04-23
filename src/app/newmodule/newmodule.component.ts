import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { ServeiAutenticarService } from '../servei-autenticar.service';

@Component({
  selector: 'app-newmodule',
  templateUrl: './newmodule.component.html',
  styleUrls: ['../newcicle/newcicle.component.css']
})
export class NewmoduleComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  modul = {
    Nom: '',
    Hores: 0,
    IdCicle: 0,
    IdModul: 0
  };

  cicles: Array<{ id: number, nom: string }> = [];

  constructor(
    private db: AngularFireDatabase,
    private serveiAutenticar: ServeiAutenticarService
  ) {}

  ngOnInit(): void {
    this.db.list('cicles').valueChanges().subscribe((data: any) => {
      this.cicles = data.map((cicle: any) => ({
        id: cicle.IdCicle,
        nom: cicle.Nom
      }));
    });
  }

  closeModal() {
    this.close.emit();
  }

  addModule() {
    const nom = this.serveiAutenticar.getUsuariActual();

    const nuevoModulo = {
      ...this.modul,
      nomProfesor: nom
    };

    const ref = this.db.list('/moduls');
    ref.set(nuevoModulo.Nom, nuevoModulo)
      .then(() => {
        console.log('Mòdul afegit amb èxit');
        // this.close.emit(); // cerrar modal
      })
      .catch(error => {
        console.error('Error afegint el mòdul:', error);
      });
  }


}
