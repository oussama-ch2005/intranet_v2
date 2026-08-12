import { CanActivateFn,Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../service/auth';
export const adminGuard: CanActivateFn = () => {
  const auth=inject(Auth);
  const router=inject(Router);
  if(auth.estAdmin()){
    return true;
  }
  router.navigate(['/user/objets']);
  return false;
};
