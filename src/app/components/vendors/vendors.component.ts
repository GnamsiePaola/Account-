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
import { MatDialogModule } from '@angular/material/dialog';

import { Vendor, VendorService } from '../../services/vendor.service';
import { BusinessService } from '../../services/business.service';
import { BusinessSelectorComponent } from '../business-selector/business-selector.component';

@Component({
    selector: 'app-vendors',
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
      <h1>Vendors</h1>
      
      <app-business-selector></app-business-selector>
      
      <mat-card>
        <mat-card-header>
          <mat-card-title>Vendor List</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div *ngIf="vendors.length === 0" class="empty-message">
            <p>No vendors found for this business.</p>
          </div>
          
          <table mat-table [dataSource]="vendors" class="mat-elevation-z2" *ngIf="vendors.length > 0">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let vendor">{{ vendor.vendorName }}</td>
            </ng-container>
            
            <ng-container matColumnDef="contact">
              <th mat-header-cell *matHeaderCellDef>Contact</th>
              <td mat-cell *matCellDef="let vendor">{{ vendor.Contact }}</td>
            </ng-container>
            
            <ng-container matColumnDef="payment">
              <th mat-header-cell *matHeaderCellDef>Payment Method</th>
              <td mat-cell *matCellDef="let vendor">{{ vendor.Payment }}</td>
            </ng-container>
            
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let vendor">
                <button mat-icon-button color="primary" (click)="editVendor(vendor)">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="deleteVendor(vendor)">
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
          <mat-card-title>{{ editMode ? 'Edit Vendor' : 'Add New Vendor' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="vendorForm" (ngSubmit)="saveVendor()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Vendor Name</mat-label>
              <input matInput formControlName="vendorName" required>
              <mat-error *ngIf="vendorForm.get('vendorName')?.invalid">Vendor name is required</mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contact Information</mat-label>
              <input matInput formControlName="Contact" required>
              <mat-error *ngIf="vendorForm.get('Contact')?.invalid">Contact information is required</mat-error>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Payment Method</mat-label>
              <input matInput formControlName="Payment" required>
              <mat-error *ngIf="vendorForm.get('Payment')?.invalid">Payment method is required</mat-error>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="vendorForm.invalid">
                {{ editMode ? 'Update' : 'Add' }} Vendor
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
export class VendorsComponent implements OnInit {
    vendors: Vendor[] = [];
    vendorForm: FormGroup;
    displayedColumns: string[] = ['name', 'contact', 'payment', 'actions'];
    editMode = false;
    editingVendorId: number | null = null;

    constructor(
        private vendorService: VendorService,
        private businessService: BusinessService,
        private fb: FormBuilder,
        private snackBar: MatSnackBar
    ) {
        this.vendorForm = this.fb.group({
            vendorName: ['', Validators.required],
            Contact: ['', Validators.required],
            Payment: ['', Validators.required],
            Business_idBusiness: [null, Validators.required],
            Business_user_userid: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        // Initialize with selected business
        this.updateSelectedBusiness();
        this.loadVendors();

        // Subscribe to business changes
        this.businessService.selectedBusiness$.subscribe(business => {
            if (business) {
                this.updateSelectedBusiness();
                this.loadVendors();
            }
        });
    }

    updateSelectedBusiness(): void {
        const business = this.businessService.getCurrentSelectedBusiness();
        if (business) {
            this.vendorForm.patchValue({
                Business_idBusiness: business.idBusiness,
                Business_user_userid: business.user_userid
            });
        }
    }

    loadVendors(): void {
        const business = this.businessService.getCurrentSelectedBusiness();
        if (business && business.idBusiness) {
            this.vendorService.getVendors(business.idBusiness).subscribe(
                (vendors) => {
                    this.vendors = vendors;
                },
                (error) => {
                    console.error('Error loading vendors', error);
                    this.snackBar.open('Failed to load vendors', 'Dismiss', { duration: 3000 });
                }
            );
        } else {
            this.vendors = [];
        }
    }

    saveVendor(): void {
        if (this.vendorForm.valid) {
            if (this.editMode && this.editingVendorId !== null) {
                this.vendorService.updateVendor(this.editingVendorId, this.vendorForm.value).subscribe(
                    (updatedVendor) => {
                        const index = this.vendors.findIndex(v => v.idvendor === this.editingVendorId);
                        if (index !== -1) {
                            this.vendors[index] = updatedVendor;
                        }
                        this.snackBar.open('Vendor updated successfully', 'Dismiss', { duration: 3000 });
                        this.resetForm();
                    },
                    (error) => {
                        console.error('Error updating vendor', error);
                        this.snackBar.open('Failed to update vendor', 'Dismiss', { duration: 3000 });
                    }
                );
            } else {
                this.vendorService.addVendor(this.vendorForm.value).subscribe(
                    (newVendor) => {
                        this.vendors.push(newVendor);
                        this.snackBar.open('Vendor added successfully', 'Dismiss', { duration: 3000 });
                        this.resetForm();
                    },
                    (error) => {
                        console.error('Error adding vendor', error);
                        this.snackBar.open('Failed to add vendor', 'Dismiss', { duration: 3000 });
                    }
                );
            }
        }
    }

    editVendor(vendor: Vendor): void {
        this.editMode = true;
        this.editingVendorId = vendor.idvendor || null;
        this.vendorForm.patchValue({
            vendorName: vendor.vendorName,
            Contact: vendor.Contact,
            Payment: vendor.Payment,
            Business_idBusiness: vendor.Business_idBusiness,
            Business_user_userid: vendor.Business_user_userid
        });
    }

    deleteVendor(vendor: Vendor): void {
        if (confirm(`Are you sure you want to delete vendor ${vendor.vendorName}?`)) {
            if (vendor.idvendor) {
                this.vendorService.deleteVendor(vendor.idvendor).subscribe(
                    () => {
                        this.vendors = this.vendors.filter(v => v.idvendor !== vendor.idvendor);
                        this.snackBar.open('Vendor deleted successfully', 'Dismiss', { duration: 3000 });
                    },
                    (error) => {
                        console.error('Error deleting vendor', error);
                        this.snackBar.open('Failed to delete vendor', 'Dismiss', { duration: 3000 });
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
        this.editingVendorId = null;

        const business = this.businessService.getCurrentSelectedBusiness();
        this.vendorForm.reset({
            vendorName: '',
            Contact: '',
            Payment: '',
            Business_idBusiness: business?.idBusiness,
            Business_user_userid: business?.user_userid
        });
    }
} 