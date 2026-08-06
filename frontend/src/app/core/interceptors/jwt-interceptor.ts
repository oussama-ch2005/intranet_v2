import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');
  
  if (token) {
    const reqAvecToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(reqAvecToken);
  }
  return next(req);
};
