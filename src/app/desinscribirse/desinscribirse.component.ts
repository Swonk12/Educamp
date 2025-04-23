import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-desinscribirse',
  templateUrl: './desinscribirse.component.html',
  styleUrls: ['./desinscribirse.component.css', "../newcicle/newcicle.component.css"],
})
export class DesinscribirseComponent {
  @Input() modul: any; // Recibido desde el componente padre
  @Input() userId: number = 0;
  @Output() modalClosed = new EventEmitter<void>();

  motivos = [
    { id: 'horas_realizadas', nom: 'He hecho las horas' },
    { id: 'no_interesado', nom: 'Ya no quiero seguir cursando' },
    { id: 'otro', nom: 'Otro' }
  ];

  constructor(private db: AngularFireDatabase) {}

  closeModal() {
    this.modalClosed.emit(); // Notifica al padre para cerrar el modal
  }


  setValoracion(value: number): void {
    this.modul.Valoracion = value;
  }

  onSubmit() {
    if (this.modul.Motivo === 'otro' && !this.modul.MotivoOtro.trim()) {
      alert('Por favor, especifica el motivo.');
      return;
    }

    // Crear objeto reseña
    const resenya = {
      IdProfe: this.modul.IdProfe,
      IdUsuari: this.userId,
      Valoracion: this.modul.Valoracion || 0,
      Text: this.modul.ValoracionText || ''
    };

    console.log("Reseña generada:", resenya);

    // Buscar y eliminar la inscripción
    this.db
      .list('modulsinscrits', ref =>
        ref.orderByChild('IdModul').equalTo(this.modul.IdModul)
      )
      .snapshotChanges()
      .pipe(take(1))
      .subscribe((changes: any[]) => {
        const record = changes.find(c => c.payload.val().IdUsuari === this.userId);
        if (record) {
          const key = record.payload.key;
          this.db.object(`modulsinscrits/${key}`).remove().then(() => {
            console.log('Desinscripción exitosa');
            // Aquí podrías guardar `valoracionData` en Firebase si quisieras
            this.closeModal();
          });
        }
      });
  }
}
