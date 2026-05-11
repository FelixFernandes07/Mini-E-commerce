import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost/Projecto%20Mini%20E-commerce/backend';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/routes/products.php`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/routes/products.php?id=${id}`);
  }

  create(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.post(`${this.apiUrl}/routes/products.php`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  update(id: number, data: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(`${this.apiUrl}/routes/products.php?id=${id}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  delete(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.delete(`${this.apiUrl}/routes/products.php?id=${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/routes/categories.php`);
  }
}