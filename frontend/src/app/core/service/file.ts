import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService {

  private api = 'http://localhost:8080/api/files';

  constructor(private http: HttpClient) {}

  // ✅ Upload avec progression
  upload(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.api}/upload`, formData);
  }

  // ✅ Vérifie si c'est une image
  estImage(typeFichier: string): boolean {
    return typeFichier?.startsWith('image/');
  }

  // ✅ Icône selon le type
  icone(typeFichier: string): string {
    if (!typeFichier) return '📎';
    if (typeFichier.startsWith('image/'))       return '🖼️';
    if (typeFichier.startsWith('video/'))       return '🎥';
    if (typeFichier.includes('pdf'))            return '📄';
    if (typeFichier.includes('word'))           return '📝';
    if (typeFichier.includes('excel') ||
        typeFichier.includes('sheet'))          return '📊';
    if (typeFichier.includes('zip') ||
        typeFichier.includes('compressed'))     return '🗜️';
    return '📎';
  }

  // ✅ Formater la taille
  formaterTaille(tailleKo: number): string {
    if (!tailleKo) return '';
    if (tailleKo < 1024) return `${tailleKo} Ko`;
    return `${(tailleKo / 1024).toFixed(1)} Mo`;
  }
}