# Life Drop – Blood Donation Web App

## Overview

**Life Drop** is a web application that connects blood donors with people in urgent need of blood. Users can quickly find donation requests, create their own requests, and contact donors directly. The platform also supports funding contributions to help donation-related causes.

## Screenshot

![Life Drop Screenshot](/public/Life-drop.png)

## Tech Stack

- **Framework:** React 19, Vite 7
- **Routing:** React Router 7
- **Styling:** Tailwind CSS 4, Shadcn UI
- **State Management:** TanStack Query
- **Forms:** React Hook Form, Zod
- **Authentication:** Firebase Auth
- **Payments:** Stripe
- **HTTP Client:** Axios
- **Rich Text Editor:** Jodit React

## Key Features

- **Advanced Search & Donation Requests** – Search for blood requests by blood group, district, and upazila. Authenticated users can create, update, and delete their own requests.
- **Role-Based Dashboards** – Separate dashboards for Admin, Volunteer, and regular Users with different permissions.
- **Content Management** – Admin and Volunteers can create blog posts. Admin can publish them.
- **Funding System** – Authenticated users can donate funds via Stripe integration.
- **Responsive Design** – Fully responsive UI built with Tailwind CSS and Shadcn UI components.

## Dependencies

| Package | Purpose |
|---------|---------|
| react / react-dom | UI framework |
| react-router-dom | Client-side routing |
| @tanstack/react-query | Server state management |
| axios | HTTP requests |
| react-hook-form | Form handling |
| zod | Schema validation |
| firebase | Authentication |
| @stripe/stripe-js / @stripe/react-stripe-js | Payment processing |
| tailwindcss | Utility-first CSS |
| jodit-react | Rich text editor |
| sweetalert2 | Alert dialogs |
| swiper | Carousels and sliders |
| lucide-react | Icons |
| gsap | Animations |
| sonner | Toast notifications |

## Run Locally

This repository contains **frontend only**.

1. Clone the repo:
   ```bash
   git clone https://github.com/mariyamnavila/life-drop.git
   cd life-drop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```env
   VITE_apiKey=your_firebase_api_key
   VITE_authDomain=your_firebase_auth_domain
   VITE_projectId=your_firebase_project_id
   VITE_storageBucket=your_firebase_storage_bucket
   VITE_messagingSenderId=your_firebase_messaging_sender_id
   VITE_appId=your_firebase_app_id
   VITE_payment_Key=your_stripe_public_key
   VITE_imagebb_key=your_imagebb_api_key
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

> **Note:** Backend setup is required separately. See the [backend repo](https://github.com/mariyamnavila/life-drop-server).

## Live & Repos

- **Live Site:** https://life-drop-17699.web.app
- **Backend Repo:** https://github.com/mariyamnavila/life-drop-server