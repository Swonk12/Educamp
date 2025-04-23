import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ServeiAutenticarService } from '../servei-autenticar.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  valoracionMedia: number | null = null;

  constructor(
    public serveiAutenticar: ServeiAutenticarService,
    private cdRef: ChangeDetectorRef,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    console.log("Usuario cargado en Navbar (del serveiAutenticar):", this.serveiAutenticar.usuari);

    this.afAuth.authState.subscribe(user => {
      console.log("Usuario autenticado en Firebase:", user);
      if (user && user.email) {
        this.getIdUsuariByEmail(user.email).then(idUsuari => {
          console.log("IdUsuari encontrado por email:", idUsuari);
          if (idUsuari != null) {
            this.obtenerMediaValoraciones(idUsuari);
          } else {
            console.warn("No se encontró IdUsuari en la BD para el email:", user.email);
            this.valoracionMedia = null;
          }
        });
      } else {
        console.warn("No hay usuario autenticado en Firebase.");
      }
    });

    setTimeout(() => {
      this.cdRef.detectChanges();
    }, 0);
  }

  async getIdUsuariByEmail(email: string): Promise<number | null> {
    const userKey = email.replace(/[@.]/g, '').toLowerCase();
    console.log("Key para buscar en BD (usuaris):", userKey);

    const snapshot = await this.db.object(`usuaris/${userKey}`).query.once('value');
    const data = snapshot.val();
    console.log("Datos del usuario en BD:", data);

    if (data && data.IdUsuari !== undefined) {
      return data.IdUsuari;
    }
    return null;
  }

  obtenerMediaValoraciones(idUsuari: number) {
    console.log("Buscando valoraciones para IdProfe igual a IdUsuari:", idUsuari);
    this.db.list('resenyes').valueChanges().subscribe((resenyes: any[]) => {
      console.log("Todas las resenyes leídas:", resenyes);

      // Solo las reseñas en que el usuario conectado ES el profe valorado
      const recibidas = resenyes.filter(res => {
        // Puede que IdProfe esté como string o number, así que compara así:
        return String(res.IdProfe) === String(idUsuari);
      });

      console.log(`Reseñas encontradas para el usuario como profe (IdProfe=${idUsuari}):`, recibidas);

      if (recibidas.length > 0) {
        const suma = recibidas.reduce((acc, curr) => acc + (curr.Valoracion || 0), 0);
        this.valoracionMedia = suma / recibidas.length;
        console.log(`Suma: ${suma}, Nº Reseñas: ${recibidas.length}, Media: ${this.valoracionMedia}`);
      } else {
        this.valoracionMedia = null;
        console.log("El usuario no tiene reseñas recibidas como profe, media a null.");
      }
      this.cdRef.detectChanges();
    });
  }

  logout() {
    this.serveiAutenticar.logout();
  }

  // Abrir Modals
  showAnadirCiclo = false;
  showAnadirModulo = false;

  openAnadirCiclo() {
    this.showAnadirCiclo = true;
  }

  openAnadirModulo() {
    this.showAnadirModulo = true;
  }

  closeModals() {
    this.showAnadirCiclo = false;
    this.showAnadirModulo = false;
  }
}
