import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/Projecto%20Mini%20E-commerce/backend';

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/routes/auth.php/register`, data);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/routes/auth.php`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  resetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/routes/auth.php/reset`, { email });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): any {
    try {
      const user = localStorage.getItem('user');
      if (!user || user === 'undefined') return null;
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  isAdmin(): boolean {
    const user = this.getUser();
    return user !== null && user.role === 'admin';
  }
}