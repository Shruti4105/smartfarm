🌱 FarmSmart – Smart Farming Platform

Live Domain: https://smartfarm.caffeine.xyz

FarmSmart is a full-stack smart agriculture web application built to help farmers make data-driven decisions, buy farming products, and sell crops directly online. The platform runs on the Internet Computer (ICP) blockchain using Motoko for a secure and decentralized backend.

🚀 Overview

FarmSmart empowers farmers with:

AI-based soil analysis

Smart crop recommendations

Digital agricultural marketplace

Direct farmer-to-buyer selling

Secure order and payment flow

The platform bridges agriculture and technology to create a smarter, transparent farming ecosystem.

✨ Features
🔐 User Authentication

Secure farmer registration & login

Username/password stored on-chain

Personalized dashboard

🌍 Soil Image Analysis

Upload soil image

Get crop recommendations

Soil care suggestions

🌾 Smart Crop Advisory

Enter soil and environmental parameters

AI-powered crop suggestions

Yield optimization recommendations

🛒 Seller Marketplace

Browse fertilizers, pesticides, seeds

View products from nearby sellers

🏬 FarmSmart Store

Buy directly from in-app store

Simulated card payment flow

Order confirmation

🌱 Sell Your Crops

List harvested crops and pulses

Set price and quantity

Manage listings

🛍 Buy From Farmers

Public users can browse farmer produce

Direct purchase from farmers

💳 Payment Integration

Simulated secure card payment

Order tracking

Order history page

🏗 Project Structure
```
farmsmart/
│
├── backend/
│   └── main.mo
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── PaymentForm.tsx
│   │   │   └── ProductCard.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── AuthPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SoilAnalysis.tsx
│   │   │   ├── CropAdvisory.tsx
│   │   │   ├── Marketplace.tsx
│   │   │   ├── OurStore.tsx
│   │   │   ├── SellCrops.tsx
│   │   │   ├── BuyFromFarmers.tsx
│   │   │   └── MyOrders.tsx
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   │
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── dfx.json
└── README.md
```
🛠 Tech Stack
Frontend

React

TypeScript

Tailwind CSS

Vite

Backend

Motoko

Internet Computer Canisters

Deployment

Internet Computer (ICP)

Custom Domain: smartfarm.caffeine.xyz

🌐 Application Routes
Route	Description
/	Login / Register
/dashboard	Farmer Dashboard
/soil-analysis	Soil Image Upload
/crop-advisory	Smart Crop Form
/marketplace	Seller Products
/store	FarmSmart Store
/sell-crops	List Your Crops
/buy-farmers	Buy From Farmers
/orders	My Orders
📋 Prerequisites

Make sure you have:

Node.js v18 or higher

DFX SDK (Internet Computer)

pnpm

Install pnpm globally:

npm install -g pnpm

⚙️ Installation Steps
1️⃣ Clone the Repository
git clone <your-repo-url>
cd farmsmart

2️⃣ Install Frontend Dependencies
cd frontend
pnpm install
cd ..

3️⃣ Start Local Internet Computer Replica
dfx start --background

4️⃣ Deploy Canisters Locally
dfx deploy

5️⃣ Open the Application

After deployment, you will get a URL like:

http://127.0.0.1:4943/?canisterId=<your-canister-id>


Open it in your browser.

💻 Frontend Development Mode (UI Only)
cd frontend
pnpm run dev

🛑 Stop Local Replica
dfx stop

🚀 Deploy to Mainnet

To deploy live:

dfx deploy --network ic


Live URLs:

ICP URL:
https://<canister-id>.icp0.io

Custom Domain:
https://smartfarm.caffeine.xyz

🎯 Vision

FarmSmart aims to:

Increase farmer income

Provide AI-driven crop decisions

Enable direct farmer-to-consumer sales

Reduce middlemen dependency

Digitally transform agriculture

📌 Future Enhancements

Real AI/ML soil classification model

Real payment gateway integration

Multi-language support

Mobile app version

Government scheme integration
