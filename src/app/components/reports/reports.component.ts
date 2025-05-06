import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatSelectModule,
        BaseChartDirective
    ],
    template: `
    <div class="reports-container">
      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>Revenue vs Expenses</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <canvas baseChart
            [data]="revenueExpensesData"
            [options]="chartOptions"
            [type]="'bar'">
          </canvas>
        </mat-card-content>
      </mat-card>

      <mat-card class="chart-card">
        <mat-card-header>
          <mat-card-title>Profit/Loss Trend</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <canvas baseChart
            [data]="profitTrendData"
            [options]="lineChartOptions"
            [type]="'line'">
          </canvas>
        </mat-card-content>
      </mat-card>

      <mat-card class="summary-card">
        <mat-card-header>
          <mat-card-title>Financial Summary</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="summary-grid">
            <div class="summary-item">
              <h3>Total Revenue (YTD)</h3>
              <p class="amount">₦{{ totalRevenue | number:'1.2-2' }}</p>
            </div>
            <div class="summary-item">
              <h3>Total Expenses (YTD)</h3>
              <p class="amount">₦{{ totalExpenses | number:'1.2-2' }}</p>
            </div>
            <div class="summary-item">
              <h3>Net Profit/Loss (YTD)</h3>
              <p class="amount" [ngClass]="{'profit': netProfit > 0, 'loss': netProfit < 0}">
                ₦{{ netProfit | number:'1.2-2' }}
              </p>
            </div>
            <div class="summary-item">
              <h3>Profit Margin</h3>
              <p class="amount">{{ profitMargin | number:'1.1-1' }}%</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
    styles: [`
    .reports-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .chart-card {
      margin-bottom: 20px;
    }

    .chart-card mat-card-content {
      padding: 20px;
      height: 300px;
    }

    .summary-card {
      margin-top: 20px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      padding: 20px;
    }

    .summary-item {
      text-align: center;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }

    .summary-item h3 {
      margin: 0;
      color: #666;
      font-size: 1rem;
    }

    .amount {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 10px 0 0;
    }

    .profit {
      color: #4caf50;
    }

    .loss {
      color: #f44336;
    }
  `]
})
export class ReportsComponent implements OnInit {
    totalRevenue: number = 750000;
    totalExpenses: number = 500000;
    netProfit: number = this.totalRevenue - this.totalExpenses;
    profitMargin: number = (this.netProfit / this.totalRevenue) * 100;

    revenueExpensesData: ChartConfiguration<'bar'>['data'] = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Revenue',
                data: [65000, 70000, 80000, 85000, 90000, 95000],
                backgroundColor: '#4caf50'
            },
            {
                label: 'Expenses',
                data: [45000, 48000, 52000, 55000, 58000, 60000],
                backgroundColor: '#f44336'
            }
        ]
    };

    profitTrendData: ChartConfiguration<'line'>['data'] = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Net Profit/Loss',
                data: [20000, 22000, 28000, 30000, 32000, 35000],
                borderColor: '#2196f3',
                tension: 0.1
            }
        ]
    };

    chartOptions: ChartConfiguration<'bar'>['options'] = {
        responsive: true,
        maintainAspectRatio: false
    };

    lineChartOptions: ChartConfiguration<'line'>['options'] = {
        responsive: true,
        maintainAspectRatio: false
    };

    ngOnInit() {
        // TODO: Fetch real data from service
    }
} 