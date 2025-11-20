# Micro E-Commerce Frontend

A minimal React-based frontend for the micro-ecommerce system with product and order services.

## Features

- 📦 Product listing and details
- 🛒 Shopping cart functionality
- 💳 Order placement
- 📱 Responsive design
- 💾 Local storage for cart persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## API Configuration

The frontend expects the following microservices:

- Product Service: `http://localhost:8001/api/products`
- Order Service: `http://localhost:8002/api/orders`

Configure proxy settings in `vite.config.js` if your services run on different ports.

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API integration
│   ├── pages/         # Page components
│   ├── App.jsx        # Main app component
│   ├── main.jsx       # Entry point
│   └── index.css      # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Features Overview

### Products Page

- View all available products
- Search and filter functionality
- Add items to cart

### Product Detail Page

- View detailed product information
- Check stock availability
- Add to cart

### Shopping Cart

- View cart items
- Update quantities
- Remove items
- Calculate total
- Checkout

## Technologies Used

- React 18
- React Router 6
- Axios
- Vite
- CSS3

## Development Notes

- The app includes sample data that loads when backend services are unavailable
- Cart data persists in localStorage
- All API calls are proxied through Vite dev server
