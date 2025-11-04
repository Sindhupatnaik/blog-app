# Quick Setup Guide for New Devices

## 🚀 Quick Start (3 Steps)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd blog-app
npm install
```

### 2. Setup Database Connection
```bash
cp .env.example .env
```
Then edit `.env` and update:
- `DB_USER` = your MySQL username
- `DB_PASSWORD` = your MySQL password
- `JWT_SECRET` = any random string (for security)

### 3. Run
```bash
npm run dev
```

Visit: http://localhost:3000

---

## 📝 What to Edit on New Device

### ✅ MUST EDIT:
**`.env` file** - Create this file and add your database credentials

### ❌ DON'T EDIT (usually):
- `package.json`
- `next.config.js`
- Source code files (unless fixing bugs)

---

## 🔧 Configuration Values

### Database Settings (in `.env`):
```env
DB_HOST=localhost          # Usually localhost
DB_PORT=3306              # Default MySQL port
DB_USER=root              # Your MySQL username
DB_PASSWORD=your_password # Your MySQL password
DB_NAME=blog_app          # Database name (will be created automatically)
```

### JWT Secret:
```env
JWT_SECRET=any-random-string-here-change-in-production
```

---

## ⚠️ Common Issues

**"Database connection failed"**
→ Check MySQL is running and `.env` has correct credentials

**"Port 3000 already in use"**
→ Change `PORT=3000` to another port in `.env`

**"Module not found"**
→ Run `npm install` again

---

## 📍 File Locations

- **Environment variables**: `blog-app/.env` (create this!)
- **Example config**: `blog-app/.env.example` (copy this to `.env`)
- **Database setup**: Auto-creates on first run
