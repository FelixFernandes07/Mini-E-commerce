import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost/Projecto Mini E-commerce/backend';

  constructor(private http: HttpClient) {}

  getMyOrders(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return this.http.get(`${this.apiUrl}/orders/index.php?user_id=${user.id}`);
  }

  getAllOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/index.php`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/show.php?id=${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/orders/create.php`, data);
  }

  updateStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/orders/update.php?id=${id}`, { status });
  }

  exportCSV(): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/export.php`, { responseType: 'blob' });
  }
}