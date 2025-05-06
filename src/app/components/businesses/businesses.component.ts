import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Business, BusinessService } from '../../services/business.service';

@Component({
    selector: 'app-businesses',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatDividerModule,
        MatDialogModule,
        MatSnackBarModule
    ],
    template: `
    <div class="container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Your Businesses</mat-card-title>
          <mat-card-subtitle>Select or create a business</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="business-list">
            <mat-list>
              <div *ngIf="businesses.length === 0" class="no-businesses">
                <p>You don't have any businesses yet.</p>
              </div>
              
              <mat-list-item *ngFor="let business of businesses" (click)="selectBusiness(business)">
                <div class="business-item">
                  <div>
                    <h3>{{ business.BusinessName }}</h3>
                    <p>{{ business.contact }}</p>
                  </div>
                  <button mat-icon-button (click)="deleteBusiness(business); $event.stopPropagation()">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
              </mat-list-item>
            </mat-list>
          </div>
          
          <mat-divider class="my-4"></mat-divider>
          
          <div class="create-business">
            <h2>Create New Business</h2>
            
            <form [formGroup]="businessForm" (ngSubmit)="createBusiness()">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Business Name</mat-label>
                <input matInput formControlName="BusinessName" required>
                <mat-error *ngIf="businessForm.get('BusinessName')?.invalid">Business name is required</mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Contact Information</mat-label>
                <input matInput formControlName="contact" required>
                <mat-error *ngIf="businessForm.get('contact')?.invalid">Contact information is required</mat-error>
              </mat-form-field>
              
              <button mat-raised-button color="primary" type="submit" [disabled]="businessForm.invalid">
                Create Business
              </button>
            </form>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .container {
      max-width: 800px;
      margin: 20px auto;
      padding: 0 20px;
    }
    
    .business-list {
      margin-bottom: 20px;
    }
    
    .business-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      cursor: pointer;
    }
    
    .no-businesses {
      padding: 20px;
      text-align: center;
    }
    
    .my-4 {
      margin: 1.5rem 0;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    
    mat-card {
      padding: 20px;
    }
  `]
})
export class BusinessesComponent implements OnInit {
    businesses: Business[] = [];
    businessForm: FormGroup;

    constructor(
        private businessService: BusinessService,
        private fb: FormBuilder,
        private router: Router,
        private snackBar: MatSnackBar
    ) {
        this.businessForm = this.fb.group({
            BusinessName: ['', Validators.required],
            contact: ['', Validators.required],
            user_userid: ['1'] // For now, hardcoded user ID
        });
    }

    ngOnInit(): void {
        this.loadBusinesses();
    }

    loadBusinesses(): void {
        this.businessService.getBusinesses().subscribe(
            (businesses) => {
                this.businesses = businesses;
            },
            (error) => {
                console.error('Error loading businesses', error);
                this.snackBar.open('Failed to load businesses', 'Dismiss', { duration: 3000 });
            }
        );
    }

    createBusiness(): void {
        if (this.businessForm.valid) {
            this.businessService.addBusiness(this.businessForm.value).subscribe(
                (newBusiness) => {
                    this.businesses.push(newBusiness);
                    this.snackBar.open('Business created successfully', 'Dismiss', { duration: 3000 });
                    this.businessForm.reset({
                        BusinessName: '',
                        contact: '',
                        user_userid: '1'
                    });
                },
                (error) => {
                    console.error('Error creating business', error);
                    this.snackBar.open('Failed to create business', 'Dismiss', { duration: 3000 });
                }
            );
        }
    }

    selectBusiness(business: Business): void {
        this.businessService.selectBusiness(business);
        this.router.navigate(['/dashboard']);
    }

    deleteBusiness(business: Business): void {
        if (confirm(`Are you sure you want to delete ${business.BusinessName}?`)) {
            if (business.idBusiness) {
                this.businessService.deleteBusiness(business.idBusiness).subscribe(
                    () => {
                        this.businesses = this.businesses.filter(b => b.idBusiness !== business.idBusiness);
                        this.snackBar.open('Business deleted successfully', 'Dismiss', { duration: 3000 });
                    },
                    (error) => {
                        console.error('Error deleting business', error);
                        this.snackBar.open('Failed to delete business', 'Dismiss', { duration: 3000 });
                    }
                );
            }
        }
    }
} 