import {ChangeDetectorRef, Component} from '@angular/core';
import { ServeiAutenticarService } from '../servei-autenticar.service';
import {ListopicService} from "../servei-listopic/listopic.service";

@Component({
  selector: 'app-gestionusuarios',
  templateUrl: './gestionusuarios.component.html',
  styleUrl: './gestionusuarios.component.css'
})
export class GestionusuariosComponent {
  filteredUsuaris: any[] = []; // Tots els usuaris
  carregantRol: boolean = true; // Nova variable per controlar el carregament del rol

  constructor(private cdr: ChangeDetectorRef, public serveiAutenticar: ServeiAutenticarService, private listopicService: ListopicService) {}

  ngOnInit() {
    const rol = localStorage.getItem('rol');
    console.log('Rol recuperat al recarregar la pàgina:', rol);

    this.serveiAutenticar.rol = rol ? parseInt(rol) : 2;
    this.carregantRol = false;

    this.listopicService.getUsuaris().subscribe((data) => {
      this.filteredUsuaris = data
        .slice(1)
        .map((usuari: any) => ({
          ...usuari,
          nombreRol: this.obtenerNombreRol(Number(usuari.IdRol)),
        }));
      console.log("Usuaris carregats:", this.filteredUsuaris);
    });
  }

  obtenerNombreRol(idRol: number): string {
    switch (idRol) {
      case 1: return 'Admin';
      case 2: return 'Alumno';
      case 3: return 'Profesor';
      default: return 'Desconocido';
    }
  }
}
