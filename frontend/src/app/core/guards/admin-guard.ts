import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  if (user) {
    const parsed = JSON.parse(user);
    if (parsed.role === 'admin') {
      return true;
    }
  }

  router.navigate(['/shop']);
  return false;
};