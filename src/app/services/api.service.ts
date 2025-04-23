// src/app/services/api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://api.aquero.es:5000';

  constructor(private http: HttpClient) {}

  sendVerification(to: string, userName: string, verifyUrl: string) {
    const payload = {
      to: to,
      type: 'educampVerify',
      userName: userName,
      verifyUrl: verifyUrl,
    };
    return this.http.post(`${this.baseUrl}/Mail/sendmail/verify`, payload);
  }
}
