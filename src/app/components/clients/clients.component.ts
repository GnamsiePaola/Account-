import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { Client, ClientService } from '../../services/client.service';
import { BusinessService } from '../../services/business.service';
import { BusinessSelectorComponent } from '../business-selector/business-selector.component';

@Component({
    selector: 'app-clients',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSnackBarModule,
        MatDialogModule,
        BusinessSelectorComponent
    ],
    template: `
    <div class="container">
      <h1>Clients</h1>
      
      <app-business-selector></app-business-selector>
      
      <mat-card>
        <mat-card-header>
          <mat-card-title>Client List</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div *ngIf="clients.length === 0" class="empty-message">
            <p>No clients found for this business.</p>
          </div>
          
          <table mat-table [dataSource]="clients" class="mat-elevation-z2" *ngIf="clients.length > 0">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let client">{{ client.ClientName }}</td>
            </ng-container>
            
            <ng-container matColumnDef="address">
              <th mat-header-cell *matHeaderCellDef>Address</th>
              <td mat-cell *matCellDef="let client">{{ client.Clientaddress }}</td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let client">
                <button mat-icon-button color="primary" (click)="editClient(client)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteClient(client)">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>
            
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="mt-3">
        <mat-card-header>
          <mat-card-title>{{ editMode ? 'Edit Client' : 'Add New Client' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="clientForm" (ngSubmit)="saveClient()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Client Name</mat-label>
              <input matInput formControlName="ClientName" required>
              <mat-error *ngIf="clientForm.get('ClientName')?.invalid">Client name is required</mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Client Address</mat-label>
              <input matInput formControlName="Clientaddress" required>
              <mat-error *ngIf="clientForm.get('Clientaddress')?.invalid">Client address is required</mat-error>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="clientForm.invalid">
                {{ editMode ? 'Update' : 'Add' }} Client
              </button>
              
              <button *ngIf="editMode" mat-raised-button type="button" (click)="cancelEdit()">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 0 20px;
    }
    
    .empty-message {
      padding: 20px;
      text-align: center;
    }
    
    .mt-3 {
      margin-top: 20px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
    }
    
    mat-card {
      margin-bottom: 20px;
    }
  `]
})
export class ClientsComponent implements OnInit {
    clients: Client[] = [];
    clientForm: FormGroup;
    displayedColumns: string[] = ['name', 'address', 'actions'];
    editMode = false;
    editingClientId: number | null = null;

    constructor(
        private clientService: ClientService,
        private businessService: BusinessService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        this.clientForm = this.fb.group({
            ClientName: ['', Validators.required],
            Clientaddress: ['', Validators.required],
            Business_idBusiness: [null, Validators.required],
            Business_user_userid: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        // Initialize with selected business
        this.updateSelectedBusiness();
        this.loadClients();

        // Subscribe to business changes
        this.businessService.selectedBusiness$.subscribe(business => {
            if (business) {
                this.updateSelectedBusiness();
                this.loadClients();
            }
        });
    }

    updateSelectedBusiness(): void {
        const business = this.businessService.getCurrentSelectedBusiness();
        if (business) {
            this.clientForm.patchValue({
                Business_idBusiness: business.idBusiness,
                Business_user_userid: business.user_userid
            });
        }
    }

    loadClients(): void {
        const business = this.businessService.getCurrentSelectedBusiness();
        if (business && business.idBusiness) {
            this.clientService.getClients(business.idBusiness).subscribe(
                (clients) => {
                    this.clients = clients;
                },
                (error) => {
                    console.error('Error loading clients', error);
                    this.snackBar.open('Failed to load clients', 'Dismiss', { duration: 3000 });
                }
            );
        } else {
            this.clients = [];
        }
    }

    saveClient(): void {
        if (this.clientForm.valid) {
            if (this.editMode && this.editingClientId !== null) {
                this.clientService.updateClient(this.editingClientId, this.clientForm.value).subscribe(
                    (updatedClient) => {
                        const index = this.clients.findIndex(c => c.idClient === this.editingClientId);
                        if (index !== -1) {
                            this.clients[index] = updatedClient;
                        }
                        this.snackBar.open('Client updated successfully', 'Dismiss', { duration: 3000 });
                        this.resetForm();
                    },
                    (error) => {
                        console.error('Error updating client', error);
                        this.snackBar.open('Failed to update client', 'Dismiss', { duration: 3000 });
                    }
                );
            } else {
                this.clientService.addClient(this.clientForm.value).subscribe(
                    (newClient) => {
                        this.clients.push(newClient);
                        this.snackBar.open('Client added successfully', 'Dismiss', { duration: 3000 });
                        this.resetForm();
                    },
                    (error) => {
                        console.error('Error adding client', error);
                        this.snackBar.open('Failed to add client', 'Dismiss', { duration: 3000 });
                    }
                );
            }
        }
    }

    editClient(client: Client): void {
        this.editMode = true;
        this.editingClientId = client.idClient || null;
        this.clientForm.patchValue({
            ClientName: client.ClientName,
            Clientaddress: client.Clientaddress,
            Business_idBusiness: client.Business_idBusiness,
            Business_user_userid: client.Business_user_userid
        });
    }

    deleteClient(client: Client): void {
        if (confirm(`Are you sure you want to delete client ${client.ClientName}?`)) {
            if (client.idClient) {
                this.clientService.deleteClient(client.idClient).subscribe(
                    () => {
                        this.clients = this.clients.filter(c => c.idClient !== client.idClient);
                        this.snackBar.open('Client deleted successfully', 'Dismiss', { duration: 3000 });
                    },
                    (error) => {
                        console.error('Error deleting client', error);
                        this.snackBar.open('Failed to delete client', 'Dismiss', { duration: 3000 });
                    }
                );
            }
        }
    }

    cancelEdit(): void {
        this.resetForm();
    }

    resetForm(): void {
        this.editMode = false;
        this.editingClientId = null;

        const business = this.businessService.getCurrentSelectedBusiness();
        this.clientForm.reset({
            ClientName: '',
            Clientaddress: '',
            Business_idBusiness: business?.idBusiness,
            Business_user_userid: business?.user_userid
        });
    }
} 