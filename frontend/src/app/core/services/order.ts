import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost/Projecto%20Mini%20E-commerce/backend';

  constructor(private http: HttpClient) {}

  getMyOrders(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/routes/orders.php?user_id=${user.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getAllOrders(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/routes/orders.php`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getById(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/routes/orders.php?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  create(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/routes/orders.php`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  updateStatus(id: number, status: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/routes/orders.php?id=${id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  exportCSV(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/routes/orders.php?export=csv`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
  }
}