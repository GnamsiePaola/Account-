import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Vendor {
    idvendor?: number;
    vendorName: string;
    Contact: string;
    Payment: string;
    Business_idBusiness: number;
    Business_user_userid: string;
}

@Injectable({
    providedIn: 'root'
})
export class VendorService {
    private apiUrl = 'http://localhost:3000/api';
    private mockVendors: Vendor[] = [
        {
            idvendor: 1,
            vendorName: 'Sample Vendor',
            Contact: '123-456-7890',
            Payment: 'Credit',
            Business_idBusiness: 1,
            Business_user_userid: '1'
        }
    ];

    constructor(private http: HttpClient) { }

    getVendors(businessId?: number): Observable<Vendor[]> {
        let url = `${this.apiUrl}/vendors`;
        if (businessId) {
            url += `?businessId=${businessId}`;
        }

        return this.http.get<Vendor[]>(url).pipe(
            catchError(() => {
                console.log('Using mock vendor data as server is not available');
                if (businessId) {
                    return of(this.mockVendors.filter(v => v.Business_idBusiness === businessId));
                }
                return of(this.mockVendors);
            })
        );
    }

    getVendor(id: number): Observable<Vendor> {
        return this.http.get<Vendor>(`${this.apiUrl}/vendors/${id}`).pipe(
            catchError(() => {
                const vendor = this.mockVendors.find(v => v.idvendor === id);
                if (vendor) {
                    return of(vendor);
                }
                return throwError(() => new Error('Vendor not found'));
            })
        );
    }

    addVendor(vendor: Vendor): Observable<Vendor> {
        return this.http.post<Vendor>(`${this.apiUrl}/vendors`, vendor).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const newId = this.mockVendors.length > 0 ?
                    Math.max(...this.mockVendors.map(v => v.idvendor || 0)) + 1 : 1;
                const newVendor = { ...vendor, idvendor: newId };
                this.mockVendors.push(newVendor);
                return of(newVendor);
            })
        );
    }

    updateVendor(id: number, vendor: Vendor): Observable<Vendor> {
        return this.http.put<Vendor>(`${this.apiUrl}/vendors/${id}`, vendor).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const index = this.mockVendors.findIndex(v => v.idvendor === id);
                if (index !== -1) {
                    const updatedVendor = { ...vendor, idvendor: id };
                    this.mockVendors[index] = updatedVendor;
                    return of(updatedVendor);
                }
                return throwError(() => new Error('Vendor not found'));
            })
        );
    }

    deleteVendor(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/vendors/${id}`).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const index = this.mockVendors.findIndex(v => v.idvendor === id);
                if (index !== -1) {
                    this.mockVendors.splice(index, 1);
                    return of(undefined);
                }
                return throwError(() => new Error('Vendor not found'));
            })
        );
    }
} 