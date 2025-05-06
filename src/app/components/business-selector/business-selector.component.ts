import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { Business, BusinessService } from '../../services/business.service';

@Component({
    selector: 'app-business-selector',
    standalone: true,
    imports: [
        CommonModule,
        MatSelectModule,
        MatFormFieldModule,
        FormsModule,
        MatButtonModule,
        MatIconModule
    ],
    template: `
    <div class="business-selector-container">
      <mat-form-field appearance="outline">
        <mat-label>Select Business</mat-label>
        <mat-select [(value)]="selectedBusinessId" (selectionChange)="onBusinessChange($event.value)">
          <mat-option *ngFor="let business of businesses" [value]="business.idBusiness">
            {{ business.BusinessName }}
          </mat-option>
        </mat-select>
      </mat-form-field>
      
      <button mat-mini-fab color="primary" (click)="goToBusinesses()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `,
    styles: [`
    .business-selector-container {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
    }
    
    mat-form-field {
      flex: 1;
    }
  `]
})
export class BusinessSelectorComponent implements OnInit {
    businesses: Business[] = [];
    selectedBusinessId: number | null = null;

    constructor(
        private businessService: BusinessService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadBusinesses();
        this.getCurrentBusiness();
    }

    loadBusinesses(): void {
        this.businessService.getBusinesses().subscribe(
            (businesses) => {
                this.businesses = businesses;
            },
            (error) => {
                console.error('Error loading businesses', error);
            }
        );
    }

    getCurrentBusiness(): void {
        const currentBusiness = this.businessService.getCurrentSelectedBusiness();
        if (currentBusiness && currentBusiness.idBusiness) {
            this.selectedBusinessId = currentBusiness.idBusiness;
        } else if (this.businesses.length > 0 && this.businesses[0].idBusiness) {
            this.selectedBusinessId = this.businesses[0].idBusiness;
            this.businessService.selectBusiness(this.businesses[0]);
        }
    }

    onBusinessChange(businessId: number): void {
        const selectedBusiness = this.businesses.find(b => b.idBusiness === businessId);
        if (selectedBusiness) {
            this.businessService.selectBusiness(selectedBusiness);
            // Refresh current route to update data based on selected business
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate([this.router.url]);
            });
        }
    }

    goToBusinesses(): void {
        this.router.navigate(['/businesses']);
    }
} 