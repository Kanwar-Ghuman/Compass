# Compass

A modern Lost & Found management system built for school communities. Compass helps students and staff easily report, browse, and claim lost items with a clean, accessible interface.

## Features

- 📝 **Report Found Items** - Upload photos and detailed descriptions
- 🔍 **Browse & Search** - Filter by category, location, and date
- 📧 **Email Notifications** - Automatic alerts via Brevo when items are claimed or approved
- 🔐 **Secure Authentication** - Google OAuth and OTP via Stack Auth
- 👨‍💼 **Admin Dashboard** - Review, approve, and manage all postings and claims
- ♿ **Accessibility First** - WCAG compliant with keyboard navigation and screen reader support
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **Framework:** Next.js 15 (App Router) with TypeScript
- **Styling:** Tailwind CSS with custom green theme
- **Database:** Neon (PostgreSQL) with Prisma ORM
- **Authentication:** Stack Auth (Google OAuth + OTP)
- **Email:** Brevo API for transactional emails
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Neon PostgreSQL database
- Stack Auth project credentials
- Brevo API key (optional, for email notifications)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Kanwar-Ghuman/Compass.git
cd Compass
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:

```env
# Database - Neon PostgreSQL
DATABASE_URL="your_neon_database_url"

# Stack Auth
NEXT_PUBLIC_STACK_PROJECT_ID="your_stack_project_id"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="your_stack_client_key"
STACK_SECRET_SERVER_KEY="your_stack_secret_key"

# Brevo Email (optional)
BREVO_API_KEY="your_brevo_api_key"
BREVO_SENDER_EMAIL="your_verified_sender_email"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities, database, and helpers
│   └── stack/            # Stack Auth configuration
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Admin Access

Admin users are identified by email address. To set up admin access, update the `isAdminEmail` function in `src/lib/auth.ts` with your admin email addresses.

## Email Notifications

Compass sends automatic email notifications for:
- Item approval (to the reporter)
- New claim submission (to the reporter)
- Claim verification (to the reporter when item is returned)

## License

Built for FBLA Web Design competition 2026.

## Acknowledgments

- Design inspired by modern glassmorphic UI patterns
- Logo uses Tenor Sans font
- Color palette: Green (#132A13, #31572C, #4F772D, #90A955, #ECF39E)
