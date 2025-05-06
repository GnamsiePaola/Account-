import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

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

    constructor(private http: HttpClient) { }

    // Transaction Methods
    getTransactions(): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
    }

    addTransaction(transaction: Transaction): Observable<Transaction> {
        return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction);
    }

    updateTransaction(id: number, transaction: Transaction): Observable<Transaction> {
        return this.http.put<Transaction>(`${this.apiUrl}/transactions/${id}`, transaction);
    }

    deleteTransaction(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`);
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
        return this.http.get<any>(`${this.apiUrl}/analytics/summary`);
    }

    getMonthlyReport(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/analytics/monthly`);
    }

    getProfitLossReport(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/analytics/profit-loss`);
    }
} 