import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BusinessService, Transaction } from '../../services/business/business.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  template: `
    <div class="transactions-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>Add New Transaction</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill">
              <mat-label>Type</mat-label>
              <mat-select formControlName="type">
                <mat-option value="income">Income</mat-option>
                <mat-option value="expense">Expense</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Category</mat-label>
              <mat-select formControlName="category">
                <mat-option value="sales">Sales</mat-option>
                <mat-option value="feed">Feed</mat-option>
                <mat-option value="medication">Medication</mat-option>
                <mat-option value="labor">Labor</mat-option>
                <mat-option value="utilities">Utilities</mat-option>
                <mat-option value="other">Other</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Amount</mat-label>
              <input matInput type="number" formControlName="amount">
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="date">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description"></textarea>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="!transactionForm.valid">
              Add Transaction
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="transactions-list">
        <mat-card-header>
          <mat-card-title>Recent Transactions</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="transactions">
            <ng-container matColumnDef="date">
              <th mat-header-cell *matHeaderCellDef>Date</th>
              <td mat-cell *matCellDef="let transaction">{{transaction.date | date}}</td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let transaction">{{transaction.type}}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let transaction">{{transaction.category}}</td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th mat-header-cell *matHeaderCellDef>Amount</th>
              <td mat-cell *matCellDef="let transaction">FCFA {{transaction.amount}}</td>
            </ng-container>

            <ng-container matColumnDef="description">
              <th mat-header-cell *matHeaderCellDef>Description</th>
              <td mat-cell *matCellDef="let transaction">{{transaction.description}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let transaction">
                <button mat-icon-button color="primary" (click)="editTransaction(transaction)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteTransaction(transaction)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .transactions-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .form-card {
      margin-bottom: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 20px;
    }

    .transactions-list {
      margin-top: 20px;
    }

    table {
      width: 100%;
    }

    .mat-column-date {
      width: 100px;
    }

    .mat-column-type {
      width: 100px;
    }

    .mat-column-category {
      width: 120px;
    }

    .mat-column-amount {
      width: 100px;
    }

    .mat-column-actions {
      width: 100px;
      text-align: center;
    }
  `]
})
export class TransactionsComponent {
  transactionForm: FormGroup;
  transactions: any[] = [];
  displayedColumns: string[] = ['date', 'type', 'category', 'amount', 'description', 'actions'];
  editingTransaction: Transaction | null = null;

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService
  ) {
    this.transactionForm = this.fb.group({
      type: ['', Validators.required],
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      date: [new Date(), Validators.required],
      description: ['']
    });

    // TODO: Replace with actual data from service
    this.transactions = [
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
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const transaction = this.transactionForm.value;

      if (this.editingTransaction) {
        // Update existing transaction
        this.businessService.updateTransaction(this.editingTransaction.id!, transaction)
          .subscribe({
            next: (updatedTransaction) => {
              const index = this.transactions.findIndex(t => t.id === this.editingTransaction!.id);
              if (index !== -1) {
                this.transactions[index] = updatedTransaction;
              }
              this.resetForm();
            },
            error: (error) => console.error('Error updating transaction:', error)
          });
      } else {
        // Add new transaction
        this.businessService.addTransaction(transaction)
          .subscribe({
            next: (newTransaction) => {
              this.transactions.unshift(newTransaction);
              this.resetForm();
            },
            error: (error) => console.error('Error adding transaction:', error)
          });
      }
    }
  }

  editTransaction(transaction: Transaction) {
    this.editingTransaction = transaction;
    this.transactionForm.setValue({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: new Date(transaction.date),
      description: transaction.description || ''
    });
  }

  deleteTransaction(transaction: Transaction) {
    if (transaction.id) {
      this.businessService.deleteTransaction(transaction.id)
        .subscribe({
          next: () => {
            this.transactions = this.transactions.filter(t => t.id !== transaction.id);
          },
          error: (error) => console.error('Error deleting transaction:', error)
        });
    }
  }

  resetForm() {
    this.editingTransaction = null;
    this.transactionForm.reset({
      date: new Date()
    });
  }
} 