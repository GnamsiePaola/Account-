import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-inventory',
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
        MatIconModule
    ],
    template: `
    <div class="inventory-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>Add Inventory Item</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="inventoryForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="fill">
              <mat-label>Item Name</mat-label>
              <input matInput formControlName="name">
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Category</mat-label>
              <mat-select formControlName="category">
                <mat-option value="livestock">Livestock</mat-option>
                <mat-option value="feed">Feed</mat-option>
                <mat-option value="medication">Medication</mat-option>
                <mat-option value="equipment">Equipment</mat-option>
                <mat-option value="other">Other</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Quantity</mat-label>
              <input matInput type="number" formControlName="quantity">
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Unit Cost</mat-label>
              <input matInput type="number" formControlName="unitCost">
            </mat-form-field>

            <mat-form-field appearance="fill">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description"></textarea>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="!inventoryForm.valid">
              Add Item
            </button>
          </form>
        </mat-card-content>
      </mat-card>

      <mat-card class="inventory-list">
        <mat-card-header>
          <mat-card-title>Current Inventory</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="inventoryItems">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let item">{{item.name}}</td>
            </ng-container>

            <ng-container matColumnDef="category">
              <th mat-header-cell *matHeaderCellDef>Category</th>
              <td mat-cell *matCellDef="let item">{{item.category}}</td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>Quantity</th>
              <td mat-cell *matCellDef="let item">{{item.quantity}}</td>
            </ng-container>

            <ng-container matColumnDef="unitCost">
              <th mat-header-cell *matHeaderCellDef>Unit Cost</th>
              <td mat-cell *matCellDef="let item">₦{{item.unitCost}}</td>
            </ng-container>

            <ng-container matColumnDef="totalValue">
              <th mat-header-cell *matHeaderCellDef>Total Value</th>
              <td mat-cell *matCellDef="let item">₦{{item.quantity * item.unitCost}}</td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let item">
                <button mat-icon-button color="primary" (click)="editItem(item)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteItem(item)">
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
    .inventory-container {
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

    .inventory-list {
      margin-top: 20px;
    }

    table {
      width: 100%;
    }

    .mat-column-name {
      flex: 2;
    }

    .mat-column-category,
    .mat-column-quantity,
    .mat-column-unitCost,
    .mat-column-totalValue {
      flex: 1;
    }

    .mat-column-actions {
      width: 100px;
    }
  `]
})
export class InventoryComponent {
    inventoryForm: FormGroup;
    inventoryItems: any[] = [];
    displayedColumns: string[] = ['name', 'category', 'quantity', 'unitCost', 'totalValue', 'actions'];

    constructor(private fb: FormBuilder) {
        this.inventoryForm = this.fb.group({
            name: ['', Validators.required],
            category: ['', Validators.required],
            quantity: ['', [Validators.required, Validators.min(0)]],
            unitCost: ['', [Validators.required, Validators.min(0)]],
            description: ['']
        });

        // TODO: Replace with actual data from service
        this.inventoryItems = [
            {
                name: 'Layer Birds',
                category: 'livestock',
                quantity: 500,
                unitCost: 1500,
                description: 'Layer chickens for egg production'
            },
            {
                name: 'Chicken Feed',
                category: 'feed',
                quantity: 100,
                unitCost: 5000,
                description: 'High quality chicken feed (50kg bags)'
            }
        ];
    }

    onSubmit() {
        if (this.inventoryForm.valid) {
            const item = this.inventoryForm.value;
            this.inventoryItems.unshift(item);
            this.inventoryForm.reset();
        }
    }

    editItem(item: any) {
        // TODO: Implement edit functionality
        console.log('Edit item:', item);
    }

    deleteItem(item: any) {
        // TODO: Implement delete functionality
        console.log('Delete item:', item);
    }
} 