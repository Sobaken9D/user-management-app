import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();
  
  // Делаем геттер для доступа к текущим значениям
  getUsersSnapshot(): User[] {
    return this.usersSubject.getValue();
  }

  constructor(private http: HttpClient) {}

  loadUsers(): void {
    this.http.get<User[]>(this.apiUrl).subscribe(users => {
      this.usersSubject.next(users);
    });
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      tap(newUser => {
        const currentUsers = this.usersSubject.getValue();
        this.usersSubject.next([...currentUsers, newUser]);
      })
    );
  }

  updateUser(user: User): Observable<User> {
    // Если ID > 10, мы знаем, что на сервере этого пользователя нет, 
    // поэтому имитируем успешный запрос
    if (user.id > 10) {
      return new Observable<User>(observer => {
        const currentUsers = this.usersSubject.getValue();
        const index = currentUsers.findIndex(u => u.id === user.id);
        if (index !== -1) {
          currentUsers[index] = user;
          this.usersSubject.next([...currentUsers]);
        }
        observer.next(user);
        observer.complete();
      });
    }

    // Иначе делаем реальный запрос к API
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user).pipe(
      tap(updatedUser => {
        const currentUsers = this.usersSubject.getValue();
        const index = currentUsers.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          currentUsers[index] = updatedUser;
          this.usersSubject.next([...currentUsers]);
        }
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    // Если ID > 10, имитируем успешное удаление локально
    if (id > 10) {
      return new Observable<void>(observer => {
        const currentUsers = this.usersSubject.getValue();
        this.usersSubject.next(currentUsers.filter(u => u.id !== id));
        observer.next();
        observer.complete();
      });
    }

    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const currentUsers = this.usersSubject.getValue();
        this.usersSubject.next(currentUsers.filter(u => u.id !== id));
      })
    );
  }
}
