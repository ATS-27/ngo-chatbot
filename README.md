# 🌿 Vasundhara Abhiyan - Production Chatbot & Admin System

> **A Cost-Effective, Multilingual (English, हिंदी, मराठी), AI-Powered Companion & Volunteer Hub for Vasundhara Abhiyan (Baner-Pashan Hills, Pune).**

---

## 📌 Executive Summary

This project delivers a **zero-maintenance, low-cost conversational AI and operations platform** specifically designed for **Vasundhara Abhiyan**, an environmental NGO dedicated to reviving the hill ecosystems of Baner, Pashan, and Tukai Hill in Pune.

Instead of expensive enterprise cloud vector databases (which cost $50–$100+/month), this system uses a **smart hybrid edge architecture**:
1. **Curated Local Knowledge Base (Instant, 0 latency, 0 cost)**: High-precision verified facts on tree species, timings, 80G tax exemptions, and hill directions.
2. **Groq Cloud Open-Weight LLM (Sub-100ms inference, near-zero cost)**: Handles colloquial, complex, or conversational visitor questions in fluent English, Hindi, and Marathi.
3. **Secured Administrative Control Panel**: Protected behind password authentication to manage volunteers, view analytics, copy embed codes, and review unanswered visitor queries.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| 🌐 **Trilingual Fluidity** | Seamless auto-detection and response across **English**, **हिंदी**, and **मराठी**. |
| ⚡ **Dual Deployment Modes** | 1) Full NGO Portal SPA, 2) Embeddable `<script src="widget.js">` for WordPress/Wix. |
| 🤝 **Automated Volunteer Onboarding** | Conversational registration capturing Full Name, WhatsApp Number, and Availability. |
| 💳 **80G Donation & QR Code** | Provides official NGO bank details, 50% tax exemption rules, and QR code for UPI payments. |
| 🔐 **Secured Admin Panel** | Authentication-protected control center with volunteer records, stats, and query logs. |
| 📬 **Auto Unanswered Query Inbox** | Automatically captures visitor questions the AI couldn't fully answer so NGO staff can expand FAQs. |
| 💰 **Extreme Cost Efficiency** | Free-tier eligible on Vercel/Netlify/Cloudflare + Groq free/cents tier ($0.00/month initial cost). |

---

## 🔑 Admin Credentials (For Demonstration)

- **Access Route**: Select **Admin Panel** in the top navigation bar (or navigate to `/admin/login`).
- **Username**: `admin`
- **Password**: `vasundhara@2026`

*Tip: NGO mentors can use the "Export CSV" button to download all volunteer registrations, or view the "Unanswered Queries" inbox to see knowledge gaps.*

---

## 📦 Deployment Options & Modes

### Mode 1: Full NGO Portal (Standalone Web Application)
Deploy the built single-page application (`dist/`) directly to any static web host:
- **Vercel / Cloudflare Pages / Netlify**: 100% Free
- **AWS S3 + CloudFront**: ~$0.50/month

```bash
# Build production bundle
npm run build:portal

# Output: dist/index.html + assets
```

### Mode 2: Standalone Floating Widget (For Existing WordPress / Wix / HTML Sites)
The standalone widget compiles to a single, isolated Javascript bundle (`dist/widget.js`):
1. Upload `widget.js` to your existing website's media library, AWS S3, or CDN.
2. Paste this single snippet before `</body>` on any webpage:

```html
<!-- Vasundhara Abhiyan Smart Chat Widget -->
<script src="https://your-ngo-domain.org/widget.js"></script>
```

A live simulation is available in `public/widget-demo.html`.

---

## 🛠️ Step-by-Step Mentor Demo Walkthrough

When presenting this project to NGO mentors, follow this 4-step sequence:

### 1. Show Intent & Number Handling
- Send **`1`**: The bot immediately asks for the user's name for Volunteer Registration.
- Send **`2`**: Displays 80G tax exemption details, PAN card, and UPI QR code.
- Send **`3`**: Shows Tukai Hill GPS coordinates, morning timings (7:00 AM - 9:00 AM), and landmarks.
- Send **`4`**: Displays official NGO contact emails and phone numbers.

### 2. Demonstrate Multilingual AI Flexibility
Ask natural conversational questions in different languages:
- **English**: *"Can college students volunteer for CSR certificate?"*
- **Hindi**: *"क्या पेड़ लगाने के लिए मुझे कोई पौधे या औजार लाने होंगे?"* (Do I need to bring tools?)
- **Marathi**: *"टेकडीवर कोणत्या प्रकारची झाडे लावली जातात?"* (Which trees are planted on the hill?)
- The bot detects the language and answers accurately with verified NGO facts.

### 3. Demonstrate the Standalone Widget Embed
- Open `http://localhost:5173/widget-demo.html` in your browser.
- Show how the floating circular button appears on a completely separate webpage and delivers the full conversational experience.

### 4. Open the Secured Admin Dashboard
- Switch to the **Admin Panel** tab.
- Enter `admin` / `vasundhara@2026`.
- Review:
  - **Volunteer Roster**: All registered volunteers with 1-click CSV download.
  - **Unanswered Queries Inbox**: Shows logged queries that need FAQ entries.
  - **Analytics**: Language distribution charts (English vs. Hindi vs. Marathi).
  - **Widget Integration Code Generator**: 1-click embed code for web developers.

---

## 💵 Total Cost Breakdown for the NGO

| Component | Recommended Solution | Cost per Month |
| :--- | :--- | :--- |
| **Website & Widget Hosting** | Cloudflare Pages / Vercel Hobby / Netlify | **$0.00** (Free Tier) |
| **LLM Inference** | Groq Cloud API (Llama 3 / Qwen Open Weights) | **$0.00** (Generous free tier; < $0.10 for 50,000 queries) |
| **Database & Analytics** | Local storage / lightweight Supabase / Google Sheets API | **$0.00** |
| **Total Estimated Cost** | — | **₹0 - ₹100 / month** |

---

## 💻 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and enter your VITE_GROQ_API_KEY (optional, fallback engine active)

# 3. Start development server
npm run dev

# 4. Production build
npm run build
```
