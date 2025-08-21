# 💎 Soni Jewellers & Navratna Bhandar  

A **premium jewelry e-commerce platform** built with **Next.js 14, Supabase, and Tailwind CSS**, offering a seamless online shopping experience for customers and a powerful admin dashboard for store management.  

---

## ✨ Features  

### 🛒 Customer Features
- 🔐 **Authentication** with Supabase (Email/Password + Google OAuth)  
- 👑 Browse **premium jewelry catalog** with search & filtering  
- ⭐ **Wishlist functionality** for favorite items  
- 🛍️ **Shopping cart** with localStorage persistence  
- 💰 **Dynamic pricing** based on live metal rates  
- 📦 **Order placement & tracking** (with 25% advance payment option)  
- 🎁 **Gift message & delivery options**  
- 📱 Fully **responsive design** for all devices  

### 👨‍💼 Admin Features
- 📊 **Dashboard** with analytics  
- 📦 **Product & category management** (CRUD)  
- 💰 **Update metal rates** dynamically  
- 🛒 **Manage orders** with status updates  
- 👥 **User management** (assign admin roles)  

---

## 🛠️ Tech Stack  

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS  
- **Backend**: Supabase (Database, Auth, Storage)  
- **UI Components**: ShadCN UI, Radix UI  
- **Icons**: Lucide React  
- **Styling**: Tailwind CSS  

---

## 🚀 Getting Started  

### ✅ Prerequisites
- Node.js **18+**  
- npm or yarn  
- Supabase account  

---

### 📥 Installation  

1. **Clone the repository**  
```bash
git clone <repository-url>
cd soni-jewellers
```
2. **Install dependencies**
```bash
npm install
```
3. **Set up environment variables**
 - Create a .env.local file in the root directory:
 ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```
4. **Set up Supabase**

    - Create a new Supabase project

    - Create Required Tables

    - Enable authentication providers (Google OAuth optional)
5. **Run the development server*
```bash
    npm run dev
```
---

##🔒 Authentication

Email/Password login via Supabase

Google OAuth (optional, can be enabled in Supabase dashboard)

Role-based access control (Customer / Admin)

📈 Future Enhancements

💳 Payment Gateway Integration (Razorpay/Stripe)

📱 Mobile app version with React Native

🌎 Multi-language support

🛡️ Enhanced security with 2FA

---

##🤝 Contributing

Contributions are welcome! Please fork this repository, create a branch, and submit a pull request.

---

##📜 License

This project is licensed under the MIT License – you’re free to use, modify, and distribute it.

---

##👨‍💻 Author

Developed with ❤️ by Abhishek Kumar Mishra