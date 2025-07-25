# Soni Jewellers And Navratna Bhandar

A premium jewelry e-commerce website built with Next.js 14, Supabase, and Tailwind CSS.

## Features

- 🔐 Authentication with Supabase (Email/Password + Google OAuth)
- 👑 Premium jewelry catalog with filtering and search
- 🛍️ Shopping cart with localStorage persistence
- 📱 Responsive design optimized for all devices
- 👨‍💼 Admin panel for product and order management
- 💰 Dynamic pricing based on metal rates
- 📦 Order management with status tracking
- 🎁 Gift message and delivery options
- ⭐ Wishlist functionality

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **UI Components**: ShadCN UI, Radix UI
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd tanishq-jewelry-shop
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
Create a `.env.local` file in the root directory:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

4. Set up Supabase:
- Create a new Supabase project
- Run the SQL scripts in the `scripts/` folder to create tables
- Configure authentication providers (Google OAuth optional)

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

Run the following SQL scripts in your Supabase SQL editor:

1. `scripts/01-create-tables.sql` - Creates all necessary tables and RLS policies
2. `scripts/02-seed-data.sql` - Adds sample data for testing

## Admin Setup

To create an admin user:

1. Sign up through the website
2. In Supabase, go to Authentication > Users
3. Find your user and note the UUID
4. In the SQL editor, run:
\`\`\`sql
UPDATE public.users SET role = 'admin' WHERE id = 'your-user-uuid';
\`\`\`

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
├── lib/                   # Utility functions and configurations
├── scripts/               # Database setup scripts
└── public/               # Static assets
\`\`\`

## Key Features

### Customer Features
- Browse products by category, metal type, and collection
- Dynamic pricing based on current metal rates
- Shopping cart with quantity management
- Order placement with 25% advance payment
- Order tracking and history
- Wishlist functionality
- Responsive design for mobile and desktop

### Admin Features
- Product management (CRUD operations)
- Category management
- Metal rates updates
- Order management and status updates
- User management
- Dashboard with analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
