import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Business {
    idBusiness?: number;
    BusinessName: string;
    contact: string;
    user_userid: string;
}

export interface Transaction {
    id?: number;
    date: Date;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string;
    business_id: number;
}

export interface InventoryItem {
    id?: number;
    name: string;
    category: string;
    quantity: number;
    unitCost: number;
    description: string;
    business_id: number;
}

@Injectable({
    providedIn: 'root'
})
export class BusinessService {
    private apiUrl = 'http://localhost:3000/api';

    // Mock data
    private mockBusinesses: Business[] = [
        {
            idBusiness: 1,
            BusinessName: 'Sample Business',
            contact: '123-456-7890',
            user_userid: '1'
        }
    ];

    private mockTransactions: Transaction[] = [
        {
            id: 1,
            date: new Date(),
            type: 'income',
            category: 'sales',
            amount: 50000,
            description: 'Sold 100 chickens',
            business_id: 1
        },
        {
            id: 2,
            date: new Date(),
            type: 'expense',
            category: 'feed',
            amount: 20000,
            description: 'Monthly feed purchase',
            business_id: 1
        }
    ];

    private mockInventory: InventoryItem[] = [
        {
            id: 1,
            name: 'Chicken Feed',
            category: 'Feed',
            quantity: 100,
            unitCost: 500,
            description: 'Premium chicken feed',
            business_id: 1
        }
    ];

    // Current selected business
    private selectedBusinessSubject = new BehaviorSubject<Business | null>(null);
    selectedBusiness$ = this.selectedBusinessSubject.asObservable();

    constructor(private http: HttpClient) { }

    // Business Methods
    getBusinesses(): Observable<Business[]> {
        return this.http.get<Business[]>(`${this.apiUrl}/business`).pipe(
            catchError(() => {
                console.log('Using mock business data as server is not available');
                return of(this.mockBusinesses);
            })
        );
    }

    getBusiness(id: number): Observable<Business> {
        return this.http.get<Business>(`${this.apiUrl}/business/${id}`).pipe(
            catchError(() => {
                const business = this.mockBusinesses.find(b => b.idBusiness === id);
                if (business) {
                    return of(business);
                }
                return throwError(() => new Error('Business not found'));
            })
        );
    }

    addBusiness(business: Business): Observable<Business> {
        return this.http.post<Business>(`${this.apiUrl}/business`, business).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const newId = this.mockBusinesses.length > 0 ?
                    Math.max(...this.mockBusinesses.map(b => b.idBusiness || 0)) + 1 : 1;
                const newBusiness = { ...business, idBusiness: newId };
                this.mockBusinesses.push(newBusiness);
                return of(newBusiness);
            })
        );
    }

    updateBusiness(id: number, business: Business): Observable<Business> {
        return this.http.put<Business>(`${this.apiUrl}/business/${id}`, business).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const index = this.mockBusinesses.findIndex(b => b.idBusiness === id);
                if (index !== -1) {
                    const updatedBusiness = { ...business, idBusiness: id };
                    this.mockBusinesses[index] = updatedBusiness;
                    return of(updatedBusiness);
                }
                return throwError(() => new Error('Business not found'));
            })
        );
    }

    deleteBusiness(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/business/${id}`).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const index = this.mockBusinesses.findIndex(b => b.idBusiness === id);
                if (index !== -1) {
                    this.mockBusinesses.splice(index, 1);
                    return of(undefined);
                }
                return throwError(() => new Error('Business not found'));
            })
        );
    }

    // Current selected business management
    selectBusiness(business: Business): void {
        this.selectedBusinessSubject.next(business);
        localStorage.setItem('selectedBusiness', JSON.stringify(business));
    }

    getCurrentSelectedBusiness(): Business | null {
        const stored = localStorage.getItem('selectedBusiness');
        const business = stored ? JSON.parse(stored) : null;
        if (business && !this.selectedBusinessSubject.value) {
            this.selectedBusinessSubject.next(business);
        }
        return this.selectedBusinessSubject.value;
    }

    // Transaction Methods
    getTransactions(businessId?: number): Observable<Transaction[]> {
        let url = `${this.apiUrl}/transactions`;
        if (businessId) {
            url += `?businessId=${businessId}`;
        }

        return this.http.get<Transaction[]>(url).pipe(
            catchError(() => {
                console.log('Using mock transactions data as server is not available');
                if (businessId) {
                    return of(this.mockTransactions.filter(t => t.business_id === businessId));
                }
                return of(this.mockTransactions);
            })
        );
    }

    addTransaction(transaction: Transaction): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const newId = this.mockTransactions.length > 0 ?
                    Math.max(...this.mockTransactions.map(t => t.id || 0)) + 1 : 1;
                const newTransaction = { ...transaction, id: newId };
                this.mockTransactions.unshift(newTransaction);
                return of(newTransaction);
            })
        );
    }

    updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
        return this.http.put<Transaction>(`${this.apiUrl}/transactions/${id}`, transaction).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const index = this.mockTransactions.findIndex(t => t.id === id);
                if (index !== -1) {
                    const updatedTransaction = { ...transaction, id };
                    this.mockTransactions[index] = updatedTransaction;
                    return of(updatedTransaction);
                }
                return throwError(() => new Error('Transaction not found'));
            })
        );
    }

    deleteTransaction(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const index = this.mockTransactions.findIndex(t => t.id === id);
                if (index !== -1) {
                    this.mockTransactions.splice(index, 1);
                    return of(undefined);
                }
                return throwError(() => new Error('Transaction not found'));
            })
        );
    }

    // Inventory Methods
    getInventoryItems(businessId?: number): Observable<InventoryItem[]> {
        let url = `${this.apiUrl}/inventory`;
        if (businessId) {
            url += `?businessId=${businessId}`;
        }

        return this.http.get<InventoryItem[]>(url).pipe(
            catchError(() => {
                console.log('Using mock inventory data as server is not available');
                if (businessId) {
                    return of(this.mockInventory.filter(i => i.business_id === businessId));
                }
                return of(this.mockInventory);
            })
        );
    }

    addInventoryItem(item: InventoryItem): Observable<InventoryItem> {
        return this.http.post<InventoryItem>(`${this.apiUrl}/inventory`, item).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const newId = this.mockInventory.length > 0 ?
                    Math.max(...this.mockInventory.map(i => i.id || 0)) + 1 : 1;
                const newItem = { ...item, id: newId };
                this.mockInventory.push(newItem);
                return of(newItem);
            })
        );
    }

    updateInventoryItem(id: number, item: InventoryItem): Observable<InventoryItem> {
        return this.http.put<InventoryItem>(`${this.apiUrl}/inventory/${id}`, item).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const index = this.mockInventory.findIndex(i => i.id === id);
                if (index !== -1) {
                    const updatedItem = { ...item, id };
                    this.mockInventory[index] = updatedItem;
                    return of(updatedItem);
                }
                return throwError(() => new Error('Inventory item not found'));
            })
        );
    }

    deleteInventoryItem(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/inventory/${id}`).pipe(
            catchError(() => {
                console.log('Using mock data - server not available');
                const index = this.mockInventory.findIndex(i => i.id === id);
                if (index !== -1) {
                    this.mockInventory.splice(index, 1);
                    return of(undefined);
                }
                return throwError(() => new Error('Inventory item not found'));
            })
        );
    }

    // Analytics Methods
    getFinancialSummary(businessId?: number): Observable<any> {
        let url = `${this.apiUrl}/analytics/summary`;
        if (businessId) {
            url += `?businessId=${businessId}`;
        }

        return this.http.get<any>(url).pipe(
            catchError(() => {
                // Calculate from mock data
                let transactions = this.mockTransactions;
                if (businessId) {
                    transactions = transactions.filter(t => t.business_id === businessId);
                }

                const totalIncome = transactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);
                const totalExpenses = transactions
                    .filter(t => t.type === 'expense')
                    .reduce((sum, t) => sum + t.amount, 0);
                const netProfit = totalIncome - totalExpenses;
                const profitMargin = totalIncome ? (netProfit / totalIncome) * 100 : 0;

                return of({
                    totalIncome,
                    totalExpenses,
                    netProfit,
                    profitMargin
                });
            })
        );
    }
} 