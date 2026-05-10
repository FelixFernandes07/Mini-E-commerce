import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './user-manage.html',
  styleUrl: './user-manage.scss'
})
export class UserManageComponent implements OnInit {
  users: any[] = [];
  loading = true;
  showForm = false;
  success = '';
  error = '';

  form = {
    name: '',
    email: '',
    password: '',
    role: 'client'
  };

  private apiUrl = 'http://localhost/Projecto Mini E-commerce/backend';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    const token = localStorage.getItem('token');
    this.http.get(`${this.apiUrl}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (res: any) => {
        this.users = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  createUser() {
    const token = localStorage.getItem('token');
    this.http.post(`${this.apiUrl}/users`, this.form, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.success = 'Utilizador criado com sucesso!';
        this.showForm = false;
        this.form = { name: '', email: '', password: '', role: 'client' };
        this.loadUsers();
        setTimeout(() => this.success = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Erro ao criar utilizador!';
      }
    });
  }

  updateRole(id: number, role: string) {
    const token = localStorage.getItem('token');
    this.http.put(`${this.apiUrl}/users/${id}`, { role }, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: () => {
        this.success = 'Role actualizado!';
        this.loadUsers();
        setTimeout(() => this.success = '', 3000);
      },
      error: () => this.error = 'Erro ao actualizar role!'
    });
  }

  deleteUser(id: number) {
    if (confirm('Tens a certeza que queres apagar este utilizador?')) {
      const token = localStorage.getItem('token');
      this.http.delete(`${this.apiUrl}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: () => {
          this.success = 'Utilizador apagado!';
          this.loadUsers();
          setTimeout(() => this.success = '', 3000);
        },
        error: () => this.error = 'Erro ao apagar utilizador!'
      });
    }
  }
}