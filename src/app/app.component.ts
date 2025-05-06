import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <header class="bg-primary text-white shadow-md fixed top-0 left-0 right-0 z-10">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div class="flex items-center">
            <button (click)="toggleSidebar()" class="mr-3 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span class="text-xl font-bold">Business Tracker</span>
          </div>
        </div>
      </header>

      <div class="flex flex-1 pt-16">
        <!-- Sidebar -->
        <div [class.hidden]="!sidebarOpen" class="md:block bg-white shadow-lg fixed h-full w-64 transition-all duration-300 z-10">
          <nav class="py-4">
            <ul>
              <li>
                <a routerLink="/dashboard" routerLinkActive="bg-gray-100" class="block px-4 py-3 flex items-center hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a routerLink="/transactions" routerLinkActive="bg-gray-100" class="block px-4 py-3 flex items-center hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                  </svg>
                  <span>Transactions</span>
                </a>
              </li>
              <li>
                <a routerLink="/inventory" routerLinkActive="bg-gray-100" class="block px-4 py-3 flex items-center hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
                  </svg>
                  <span>Inventory</span>
                </a>
              </li>
              <li>
                <a routerLink="/reports" routerLinkActive="bg-gray-100" class="block px-4 py-3 flex items-center hover:bg-gray-50">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm4-1a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-2-2a1 1 0 10-2 0v1a1 1 0 102 0V9z" clip-rule="evenodd" />
                  </svg>
                  <span>Reports</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <!-- Main content -->
        <div class="flex-1 md:ml-64">
          <main class="p-4">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    .app-header {
      background-color: #3f51b5;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      max-width: 1200px;
      margin: 0 auto;
      height: 60px;
    }
    
    .logo h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    
    .main-nav ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .main-nav li {
      margin: 0;
      padding: 0;
    }
    
    .main-nav a {
      color: white;
      text-decoration: none;
      padding: 20px 15px;
      display: block;
      transition: background-color 0.3s;
    }
    
    .main-nav a:hover, .main-nav a.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .app-main {
      flex: 1;
      background-color: #f5f5f5;
    }
    
    .app-footer {
      background-color: #3f51b5;
      color: white;
      padding: 20px 0;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      text-align: center;
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        height: auto;
        padding: 10px;
      }
      
      .main-nav {
        margin-top: 10px;
      }
      
      .main-nav ul {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .main-nav a {
        padding: 10px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Business Tracker';
  sidebarOpen = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
