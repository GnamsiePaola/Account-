# Business Tracker

A comprehensive business management application designed for entrepreneurs, poultry farmers, and other business owners to track their profits, losses, inventory, and overall business performance.

## Features

- Dashboard with key business metrics
- Income and expense tracking
- Inventory management
- Financial reports and analytics
- User-friendly interface
- Real-time profit/loss calculations

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Angular CLI (latest version)

## Setup Instructions

### 1. Database Setup

```bash
# Log into MySQL and create the database
mysql -u root -p
# Copy and paste the contents of server/src/schema.sql
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with your database credentials
cp .env.example .env
# Edit .env with your database credentials

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Start the development server
ng serve
```

The application will be available at `http://localhost:4200`

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=business_tracker
```

## Project Structure

```
business-tracker/
├── src/                    # Angular frontend
│   ├── app/
│   │   ├── components/    # Angular components
│   │   └── services/      # Angular services
│   └── assets/
├── server/                # Node.js backend
│   ├── src/
│   │   ├── index.js      # Server entry point
│   │   └── schema.sql    # Database schema
│   └── package.json
└── README.md
```

## Usage

1. **Dashboard**: View key metrics including total revenue, expenses, and profit/loss
2. **Transactions**: Add and manage income and expenses
3. **Inventory**: Track stock levels and inventory value
4. **Reports**: Generate financial reports and analyze business performance

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
