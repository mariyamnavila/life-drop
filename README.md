# Life Drop – Blood Donation Web App
## Project Overview

**Life Drop** is a blood donation web application that connects blood donors with people in urgent need of blood.

The platform helps users quickly find donation requests and allows donors to contact requesters directly.

It also supports funding contributions to help donation-related causes.

##  Major Features

* Advanced Search & Donation Requests

    * Donors can search for blood requests.

    * Authenticated users can create, update, and manage their own donation requests.

* Role-Based Dashboards

    * Admin dashboard to manage users, donation requests, and publish blogs.

    * Volunteer dashboard to manage and update donation request status (no edit/delete access).

    * User dashboard to manage donation requests and activities.

* Content & Funding System

    * Admin and volunteers can add blogs (volunteers cannot publish).

    * Authenticated users can donate funds using Stripe payment integration.

## Technologies Used

**Frontend**: React, React Router, React Hook Form, Tailwind CSS, Shadcn UI, TanStack Query, Axios

**Others**: Firebase Auth, Stripe, Lottie, Jodit React, Zod, SweetAlert2, Swiper

**Backend (separate repo)**: Node.js, Express.js, MongoDB, JWT, Firebase Admin

## ▶️ Run Locally

This repository contains **frontend only**.

Clone the repo and run:

`` npm install ``

`` npm run dev ``

Create a ``.env`` file with Firebase and Stripe credentials.

Backend setup is required separately:

**Backend repo**: https://github.com/mariyamnavila/life-drop-server

## Live & Repos

Live Site: https://life-drop-17699.web.app

Frontend Repo: https://github.com/mariyamnavila/life-drop