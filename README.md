# Blog App

A modern blogging platform built with Next.js, Express, and Tailwind CSS.

## Features

- ✨ Beautiful, responsive UI with Tailwind CSS
- 📝 Create, read, update, and delete blog posts
- 🔐 User authentication (signup/login)
- 👤 User-specific blog management
- 📱 Mobile-friendly design
- 💾 Database-only storage (MySQL)

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL

## Setup Instructions (For New Devices)

### Prerequisites

1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **MySQL** - [Download here](https://dev.mysql.com/downloads/mysql/)
3. **Git** (to clone the repository)

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd blog-app
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Database

1. **Start MySQL server** on your machine
2. **Create a database** (or the app will create it automatically):
   ```sql
   CREATE DATABASE blog_app;
   ```

### Step 4: Configure Environment Variables

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your database credentials:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=blog_app

   # JWT Secret (change this to a random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Server Port
   PORT=3000

   # Node Environment
   NODE_ENV=development
   ```

   **OR use DATABASE_URL format:**
   ```env
   DATABASE_URL=mysql://username:password@localhost:3306/blog_app
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=3000
   NODE_ENV=development
   ```

3. **Important:** Replace these values:
   - `DB_USER` - Your MySQL username (usually `root`)
   - `DB_PASSWORD` - Your MySQL password
   - `DB_NAME` - Database name (default: `blog_app`)
   - `JWT_SECRET` - A random secret string for JWT tokens

### Step 5: Run the Application

```bash
npm run dev
```

The app will:
- Connect to MySQL database
- Create database and tables automatically if they don't exist
- Start the development server at `http://localhost:3000`

### Step 6: Access the App

Open your browser and navigate to:
```
http://localhost:3000
```

## Files to Edit on New Device

### **`.env` file** (MOST IMPORTANT)
This file contains your database connection details and secrets. You **MUST** create this file on each new device.

**Location:** Root directory (`blog-app/.env`)

**How to create:**
1. Copy `.env.example` to `.env`
2. Edit with your local MySQL credentials

### **Configuration Files** (Usually don't need editing):
- `package.json` - Dependencies (auto-installed with `npm install`)
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration

## Scripts

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linter

## Project Structure

```
blog-app/
├── .env                    # Environment variables (CREATE THIS - not in git)
├── .env.example            # Example environment file
├── db/
│   └── connection.js       # Database connection
├── lib/
│   └── db-init.js          # Database initialization
├── middleware.js           # Next.js middleware
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   └── blogs/      # Blog endpoints
│   │   ├── blogs/          # Blog pages
│   │   ├── create/         # Create blog page
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── edit/           # Edit blog page
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   └── context/        # React context providers
│   └── components/         # Reusable components
└── package.json
```

## Troubleshooting

### Database Connection Error
- Make sure MySQL server is running
- Check your `.env` file has correct database credentials
- Verify database exists (or let the app create it automatically)

### Port Already in Use
- Change `PORT=3000` to a different port in `.env` file
- Or kill the process using port 3000

### Module Not Found Errors
- Delete `node_modules` folder and `.next` folder
- Run `npm install` again

## Production Deployment

For production, make sure to:
1. Change `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Use a production database (not localhost)
4. Set proper security headers

## License

ISC
