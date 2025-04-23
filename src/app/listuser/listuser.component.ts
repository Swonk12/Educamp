import { Component, OnInit } from '@angular/core';
import { StatususerService } from '../servei-statususer/statususer.service';

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrl: './listuser.component.css'
})
export class ListuserComponent implements OnInit {
  activeUsers: any[] = [];
  loading: boolean = true;

  constructor(private statusUserService: StatususerService) {}

  ngOnInit(): void {
    console.log("Estas en Listuser");
    this.loadActiveUsers();
  }

  // Método para obtener usuarios activos
  loadActiveUsers(): void {
    this.statusUserService.getActiveUsers().subscribe(
      (users) => {
        this.activeUsers = users;  // Asignamos los usuarios activos al array 'activeUsers'
        console.log("Usuarios activos:", this.activeUsers);
        this.loading = false;  // Cambiamos el estado de carga a 'false'
      },
      (error) => {
        console.error("Error al obtener usuarios activos:", error);
        this.loading = false;  // Cambiamos el estado de carga a 'false'
      }
    );
  }
}
