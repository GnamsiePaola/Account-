import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="card mb-6">
        <div class="card-header">
          <h2 class="card-title">Business Overview</h2>
        </div>
        <div class="card-content">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gray-100 p-6 rounded-lg text-center">
              <h3 class="text-gray-600 text-base">Total Revenue</h3>
              <p class="text-3xl font-bold mt-2">₦{{ totalRevenue | number:'1.2-2' }}</p>
            </div>
            <div class="bg-gray-100 p-6 rounded-lg text-center">
              <h3 class="text-gray-600 text-base">Total Expenses</h3>
              <p class="text-3xl font-bold mt-2">₦{{ totalExpenses | number:'1.2-2' }}</p>
            </div>
            <div class="bg-gray-100 p-6 rounded-lg text-center">
              <h3 class="text-gray-600 text-base">Net Profit/Loss</h3>
              <p class="text-3xl font-bold mt-2" 
                 [ngClass]="{'text-green-600': netProfit > 0, 'text-red-600': netProfit < 0}">
                ₦{{ netProfit | number:'1.2-2' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Quick Actions</h2>
        </div>
        <div class="card-content flex flex-wrap gap-4">
          <a routerLink="/transactions" class="btn btn-primary inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Add Transaction
          </a>
          <a routerLink="/inventory" class="btn btn-accent inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
              <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
            </svg>
            Manage Inventory
          </a>
          <a routerLink="/reports" class="btn btn-warn inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
              <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
            </svg>
            View Reports
          </a>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
    totalRevenue: number = 0;
    totalExpenses: number = 0;
    netProfit: number = 0;

    ngOnInit() {
        // TODO: Fetch real data from the service
        this.totalRevenue = 150000;
        this.totalExpenses = 100000;
        this.netProfit = this.totalRevenue - this.totalExpenses;
    }
} 