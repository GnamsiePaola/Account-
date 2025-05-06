import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Client {
    idClient?: number;
    ClientName: string;
    Clientaddress: string;
    Business_idBusiness: number;
    Business_user_userid: string;
}

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private apiUrl = 'http://localhost:3000/api';
    private mockClients: Client[] = [
        {
            idClient: 1,
            ClientName: 'Sample Client',
            Clientaddress: '123 Client Street',
            Business_idBusiness: 1,
            Business_user_userid: '1'
        }
    ];

    constructor(private http: HttpClient) { }

    getClients(businessId?: number): Observable<Client[]> {
        let url = `${this.apiUrl}/clients`;
        if (businessId) {
            url += `?businessId=${businessId}`;
        }

        return this.http.get<Client[]>(url).pipe(
            catchError(() => {
                console.log('Using mock client data as server is not available');
                if (businessId) {
                    return of(this.mockClients.filter(c => c.Business_idBusiness === businessId));
                }
                return of(this.mockClients);
            })
        );
    }

    getClient(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.apiUrl}/clients/${id}`).pipe(
            catchError(() => {
                const client = this.mockClients.find(c => c.idClient === id);
                if (client) {
                    return of(client);
                }
                return throwError(() => new Error('Client not found'));
            })
        );
    }

    addClient(client: Client): Observable<Client> {
        return this.http.post<Client>(`${this.apiUrl}/clients`, client).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const newId = this.mockClients.length > 0 ?
                    Math.max(...this.mockClients.map(c => c.idClient || 0)) + 1 : 1;
                const newClient = { ...client, idClient: newId };
                this.mockClients.push(newClient);
                return of(newClient);
            })
        );
    }

    updateClient(id: number, client: Client): Observable<Client> {
        return this.http.put<Client>(`${this.apiUrl}/clients/${id}`, client).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const index = this.mockClients.findIndex(c => c.idClient === id);
                if (index !== -1) {
                    const updatedClient = { ...client, idClient: id };
                    this.mockClients[index] = updatedClient;
                    return of(updatedClient);
                }
                return throwError(() => new Error('Client not found'));
            })
        );
    }

    deleteClient(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/clients/${id}`).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const index = this.mockClients.findIndex(c => c.idClient === id);
                if (index !== -1) {
                    this.mockClients.splice(index, 1);
                    return of(undefined);
                }
                return throwError(() => new Error('Client not found'));
            })
        );
    }
} 