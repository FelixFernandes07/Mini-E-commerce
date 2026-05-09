import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost/Projecto Mini E-commerce/backend';

  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/index.php`);
  }

  getById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/products/show.php?id=${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/products/create.php`, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/products/update.php?id=${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/products/delete.php?id=${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories/index.php`);
  }
}