import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Transaction {
    id?: number;
    date: Date;
    type: 'income' | 'expense';
    category: string;
    amount: number;
    description: string;
}

export interface InventoryItem {
    id?: number;
    name: string;
    category: string;
    quantity: number;
    unitCost: number;
    description: string;
}

@Injectable({
    providedIn: 'root'
})
export class BusinessService {
    private apiUrl = 'http://localhost:3000/api'; // TODO: Move to environment config
    private mockTransactions: Transaction[] = [
        {
            id: 1,
            date: new Date(),
            type: 'income',
            category: 'sales',
            amount: 50000,
            description: 'Sold 100 chickens'
        },
        {
            id: 2,
            date: new Date(),
            type: 'expense',
            category: 'feed',
            amount: 20000,
            description: 'Monthly feed purchase'
        }
    ];

    constructor(private http: HttpClient) { }

    // Transaction Methods
    getTransactions(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`).pipe(
            catchError(() => {
                console.log('Using mock transactions data as server is not available');
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
    getInventoryItems(): Observable<InventoryItem[]> {
        return this.http.get<InventoryItem[]>(`${this.apiUrl}/inventory`);
    }

    addInventoryItem(item: InventoryItem): Observable<InventoryItem> {
        return this.http.post<InventoryItem>(`${this.apiUrl}/inventory`, item);
    }

    updateInventoryItem(id: number, item: InventoryItem): Observable<InventoryItem> {
        return this.http.put<InventoryItem>(`${this.apiUrl}/inventory/${id}`, item);
    }

    deleteInventoryItem(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/inventory/${id}`);
    }

    // Analytics Methods
    getFinancialSummary(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/analytics/summary`).pipe(
            catchError(() => {
                // Calculate from mock data
                const totalIncome = this.mockTransactions
                    .filter(t => t.type === 'income')
                    .reduce((sum, t) => sum + t.amount, 0);
                const totalExpenses = this.mockTransactions
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

    getMonthlyReport(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/analytics/monthly`);
    }

    getProfitLossReport(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/analytics/profit-loss`);
    }
} 