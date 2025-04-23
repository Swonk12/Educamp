import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServeiEmailService {

  private apiUrl = 'http://api.aquero.es:5000/Mail/sendmail/verify'; // URL de la teva API

  constructor(private http: HttpClient) { }

  // Funció per enviar el correu de verificació
  enviarEmail(to: string, userName: string, verifyUrl: string): Observable<any> {
    const body = {
      to: to,
      type: 'educampVerify',
      userName: userName,
      verifyUrl: verifyUrl
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json' // Assumim que l'API espera JSON
    });

    return this.http.post(this.apiUrl, body, { headers });
  }
}