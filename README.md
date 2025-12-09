This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Retail Sales Management System - Frontend

A modern web interface for managing retail sales transactions with advanced search, filtering, sorting, and pagination capabilities.

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- Backend server running (see backend README for setup)

### Installation

1. Install dependencies:
```bash
pnpm install
# or
npm install
```

2. Create `.env.local` file (optional for local development):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Run the development server:
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Test Credentials

A demo account with pre-loaded dataset is available for testing:

- **Email:** `cemewox288@asurad.com`
- **Password:** `Password@123`

This account contains sample transaction data that you can use to test the search, filtering, sorting, and pagination features.

### Features

- **Authentication:** Secure login/register with Supabase Auth
- **Transaction Management:** View, search, filter, and sort transactions
- **Data Import:** Upload CSV files to import transaction data
- **Real-time Statistics:** View aggregated stats based on current filters
- **Advanced Search:** Full-text search across customer names and phone numbers
- **Multi-criteria Filtering:** Filter by region, gender, category, age, date, and more
- **Pagination:** Efficient pagination for large datasets

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
