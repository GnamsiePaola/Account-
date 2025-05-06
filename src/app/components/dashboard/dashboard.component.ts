import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusinessService } from '../../services/business.service';
import { BusinessSelectorComponent } from '../business-selector/business-selector.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BusinessSelectorComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="container">
      <h1>Dashboard</h1>
      
      <app-business-selector></app-business-selector>
      
      <mat-card class="mb-4">
        <mat-card-header>
          <mat-card-title>Business Overview</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="metrics-grid">
            <div class="metric-card">
              <h3>Total Revenue</h3>
              <p class="amount">{{ totalIncome | number:'1.2-2' }} FCFA</p>
            </div>
            <div class="metric-card">
              <h3>Total Expenses</h3>
              <p class="amount">{{ totalExpenses | number:'1.2-2' }} FCFA</p>
            </div>
            <div class="metric-card">
              <h3>Net Profit/Loss</h3>
              <p class="amount" [ngClass]="{'positive': netProfit > 0, 'negative': netProfit < 0}">
                {{ netProfit | number:'1.2-2' }} FCFA
              </p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Quick Actions</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <div class="actions-container">
            <a routerLink="/transactions" mat-raised-button color="primary">
              <mat-icon>add</mat-icon>
              Add Transaction
            </a>
            <a routerLink="/inventory" mat-raised-button color="accent">
              <mat-icon>inventory_2</mat-icon>
              Manage Inventory
            </a>
            <a routerLink="/clients" mat-raised-button color="warn">
              <mat-icon>people</mat-icon>
              Manage Clients
            </a>
            <a routerLink="/vendors" mat-raised-button color="primary">
              <mat-icon>business</mat-icon>
              Manage Vendors
            </a>
            <a routerLink="/reports" mat-raised-button>
              <mat-icon>bar_chart</mat-icon>
              View Reports
            </a>
          </div>
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
    
    .mb-4 {
      margin-bottom: 20px;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }
    
    .metric-card {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .amount {
      font-size: 24px;
      font-weight: bold;
      margin-top: 10px;
    }
    
    .positive {
      color: #4caf50;
    }
    
    .negative {
      color: #f44336;
    }
    
    .actions-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }
    
    mat-card {
      margin-bottom: 20px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalIncome: number = 0;
  totalExpenses: number = 0;
  netProfit: number = 0;
  profitMargin: number = 0;

  constructor(private businessService: BusinessService) { }

  ngOnInit() {
    // Load initial data
    this.loadDashboardData();

    // Subscribe to business changes
    this.businessService.selectedBusiness$.subscribe(business => {
      if (business) {
        this.loadDashboardData();
      }
    });
  }

  loadDashboardData() {
    const business = this.businessService.getCurrentSelectedBusiness();
    const businessId = business?.idBusiness;

    this.businessService.getFinancialSummary(businessId).subscribe(
      (summary) => {
        this.totalIncome = summary.totalIncome;
        this.totalExpenses = summary.totalExpenses;
        this.netProfit = summary.netProfit;
        this.profitMargin = summary.profitMargin;
      },
      (error) => {
        console.error('Error loading financial summary', error);
      }
    );
  }
} 