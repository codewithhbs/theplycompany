# Pradeep Timber Enterprises — Backend + Admin

## Setup
cd backend
npm install
cp .env.example .env      # edit MONGO_URI, JWT_SECRET, ADMIN_USERNAME/PASSWORD
npm run seed               # creates admin user + seeds blogs/gallery/faqs from old static content
npm start                  # runs on http://localhost:5000

## URLs
- Website: http://localhost:5000/
- Admin panel: http://localhost:5000/admin  (login with ADMIN_USERNAME/ADMIN_PASSWORD from .env)
- API base: http://localhost:5000/api

## Structure
- frontend/  -> original site (blog.html, gallery.html, index.html, contact.html modified minimally to pull dynamic data; UI/CSS untouched)
- backend/   -> Express + MongoDB API + Admin panel (served at /admin)

## Notes
- Blog/Gallery images upload backend/uploads me save hote hain, served at /uploads/<file>.
- Contact form ab bhi WhatsApp pe redirect karta hai (jaisa pehle tha) + saath me inquiry MongoDB me bhi save hoti hai, admin panel ke "Inquiries" tab me dikhti hai.
- .env kabhi commit mat karna — sirf .env.example diya hai.
