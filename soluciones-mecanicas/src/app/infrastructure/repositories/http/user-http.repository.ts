import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { UserRepositoryPort } from '../../../core/ports/out/user.repository.port';
import { User, CreateUserDTO, UpdateUserDTO } from '../../../core/domain/entities/user.entity';
import { environment, getApiUrl } from '../../config/environment';

/**
 * HTTP implementation of the User Repository Port
 */
@Injectable({
    providedIn: 'root'
})
export class UserHttpRepository extends UserRepositoryPort {
    private readonly baseUrl = getApiUrl('users');

    constructor(private http: HttpClient) {
        super();
    }

    findById(id: string): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/${id}`);
    }

    findByCredentials(email: string, password: string): Observable<User | null> {
        return this.http.get<User[]>(`${this.baseUrl}?email=${email}&password=${password}`).pipe(
            map(users => users.length > 0 ? users[0] : null)
        );
    }

    emailExists(email: string): Observable<boolean> {
        return this.http.get<User[]>(`${this.baseUrl}?email=${email}`).pipe(
            map(users => users.length > 0)
        );
    }

    findAll(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl);
    }

    create(user: CreateUserDTO): Observable<User> {
        return this.http.post<User>(this.baseUrl, user);
    }

    update(id: string, data: UpdateUserDTO): Observable<User> {
        return this.http.patch<User>(`${this.baseUrl}/${id}`, data);
    }
}
