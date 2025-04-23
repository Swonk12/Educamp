import { Component, OnInit } from '@angular/core';
import { ListopicService } from '../servei-listopic/listopic.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css'],
})
export class TopicsComponent implements OnInit {
  showModal: boolean = false;
  moduloSeleccionado: any = null;

  cicles: any[] = [];           // Ciclos obtenidos de Firebase
  modules: any[] = [];          // Todos los módulos
  filteredModules: any[] = [];  // Módulos filtrados según el ciclo seleccionado
  selectedCiclo: string = '';   // Ciclo seleccionado

  currentUserId: number | null = null;
  inscripciones: any[] = [];
  mostrarSoloInscritos: boolean = false; // Filtro del checkbox

  constructor(
    private listopicService: ListopicService,
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user && user.email) {
        console.log('Usuario autenticado:', user);
        console.log('Email del usuario:', user.email);

        this.getIdUsuariByEmail(user.email).then(idUsuari => {
          this.currentUserId = idUsuari;
          console.log('ID del usuario en BD (IdUsuari):', this.currentUserId);

          if (this.currentUserId != null) {
            this.cargarDatosDeUsuario();
          } else {
            console.warn('No se ha encontrado el usuario en la BD');
          }
        });
      } else {
        this.currentUserId = null;
        console.warn('No hay usuario autenticado');
      }
    });
  }

  // Pillar el IdUsuari desde tu nodo "usuaris"
  async getIdUsuariByEmail(email: string): Promise<number | null> {
    const userKey = email.replace(/[@.]/g, '').toLowerCase();
    console.log('Key para buscar en BD:', userKey);

    const snapshot = await this.db.object(`usuaris/${userKey}`).query.once('value');
    const data = snapshot.val();
    console.log('Datos del usuario en BD:', data);

    if (data && data.IdUsuari !== undefined) {
      return data.IdUsuari;
    }
    return null;
  }

  cargarDatosDeUsuario() {
    this.listopicService.getCicles().subscribe((data) => {
      this.cicles = data;
      console.log("Ciclos cargados:", this.cicles);
    });

    this.listopicService.getModules().subscribe((data) => {
      this.modules = data;
      this.filterModules();
      console.log("Módulos cargados:", this.modules);
    });

    if (this.currentUserId != null) {
      this.db
        .list('modulsinscrits', (ref) =>
          ref.orderByChild('IdUsuari').equalTo(this.currentUserId)
        )
        .snapshotChanges()
        .subscribe((regChanges: any[]) => {
          this.inscripciones = regChanges.map((r: any) => {
            const data = r.payload.val();
            data.key = r.payload.key;
            return data;
          });
          console.log("Inscripciones del usuario:", this.inscripciones);
          this.filterModules(); // Refrescar el filtro cada vez que cambian las inscripciones
        });
    }
  }

  // FILTRO UNIFICADO: ciclo + solo inscritos
  filterModules() {
    console.log("Ciclo seleccionado:", this.selectedCiclo, " | Mostrar solo inscritos:", this.mostrarSoloInscritos);

    // Filtrado base por ciclo
    let modulesFiltrados = this.selectedCiclo
      ? this.modules.filter(
          (module) => Number(module.IdCicle) === Number(this.selectedCiclo)
        )
      : [...this.modules];

    // Filtrar por módulos inscritos si está activado el checkbox
    if (this.mostrarSoloInscritos) {
      modulesFiltrados = modulesFiltrados.filter((module) =>
        this.isInscribed(module)
      );
    }

    // Ordena por nombre de ciclo si quieres, si no deja como está
    this.filteredModules = modulesFiltrados.sort((a, b) =>
      this.getCicleName(a.IdCicle).localeCompare(this.getCicleName(b.IdCicle))
    );

    console.log("Módulos filtrados:", this.filteredModules);
  }

  isInscribed(module: any): boolean {
    return this.inscripciones.some(
      (inscription: any) => inscription.IdModul === module.IdModul
    );
  }

  subscribeModule(module: any): void {
    console.log("Intentando inscribirse en el módulo:", module);
    if (!module.IdModul) {
      console.error("El módulo no tiene 'IdModul'. No se puede inscribir.");
      return;
    }

    if (this.isInscribed(module)) {
      console.log("El usuario ya está inscrito en el módulo:", module.Nom);
      return;
    }

    if (this.currentUserId == null) {
      console.warn("No hay usuario logueado, no se puede inscribir.");
      return;
    }

    this.db
      .list('modulsinscrits')
      .push({
        IdModul: module.IdModul,
        IdUsuari: this.currentUserId,
        timestamp: new Date().toISOString()
      })
      .then((result: any) => {
        console.log("Inscripción exitosa para el módulo:", module);
        console.log("Resultado de la operación (ID de inscripción):", result.key);
        // Opcional: this.filterModules();
      })
      .catch((error: any) => {
        console.error("Error al inscribirse en el módulo:", error);
      });
  }

  unsubscribeModule(module: any): void {
    console.log("Intentando desinscribirse del módulo:", module);

    this.db
      .list('modulsinscrits', (ref) =>
        ref.orderByChild('IdModul').equalTo(module.IdModul)
      )
      .snapshotChanges()
      .pipe(take(1))
      .subscribe((regChanges: any[]) => {
        const subscriptionRecord = regChanges.find((r: any) => {
          const reg = r.payload.val();
          return reg.IdUsuari === this.currentUserId;
        });

        if (subscriptionRecord) {
          const inscriptionKey = subscriptionRecord.key;
          console.log("Inscripción encontrada con key:", inscriptionKey);
          this.db
            .object(`modulsinscrits/${inscriptionKey}`)
            .remove()
            .then(() => {
              console.log("Desinscripción exitosa para el módulo:", module.Nom);
              // Opcional: this.filterModules();
            })
            .catch((error: any) => {
              console.error("Error al desinscribirse del módulo:", error);
            });
        } else {
          console.log("No se encontró inscripción para el módulo:", module.Nom);
        }
      });
  }

  getCicleName(id: number | null | undefined): string {
    if (id == null) return 'Sin ciclo';
    const ciclo = this.cicles.find(c => Number(c.idCicles) === Number(id));
    return ciclo ? ciclo.nombreTabla : '';
  }

  abrirModalDesinscripcion(modulo: any) {
    console.log("Abriendo modal de desinscripción para el módulo:", modulo);
    this.moduloSeleccionado = { ...modulo }; // Copia para no mutar el original
    this.showModal = true;
  }

  cerrarModalDesinscripcion() {
    this.showModal = false;
    this.moduloSeleccionado = null;
  }

}
