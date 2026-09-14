# Bosco K9 Platform (`bosco_k9`)

A comprehensive, full-stack canine ecosystem and marketplace platform tailored for Nairobi, Kenya. Bosco K9 connects dog lovers with verified breeders, provides an AI-powered breed recommendation engine, allows session bookings for professional training and boarding, and handles secure transactions via Safaricom M-Pesa STK Push.

---

## Features & Core Capabilities

* **AI Breed Advisor ("Find my breed with AI"):** An interactive assistant that guides users through a quick questionnaire matching their living situation, environment, lifestyle, and experience level to the perfect dog breed.
* **Verified Dog Marketplace:** Browse listings of puppies and adult dogs for sale in Nairobi (including German Shepherds, Rottweilers, Maltese, Labrador Retrievers, and French Bulldogs) complete with health tags, locations, and pricing in KES.
* **Secure M-Pesa Integration:** Direct STK Push payment processing integrated with Safaricom Daraja Sandbox for seamless deposits and purchases.
* **Professional Services Booking:** Book specialized canine services including puppy training, aggression training, boarding services, and professional mating services.
* **Backend & Database Architecture:** Fully persistent PostgreSQL database backend (`bosco_k9`) powered by Node.js and Express, handling API routing, authentication parameters, and transaction callbacks.



## Tech Stack

* **Frontend:** HTML5, CSS3 (Custom responsive styling with modern dark theme UI), JavaScript (ES6+)
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (`pg` pool connection)
* **Payments:** Safaricom Daraja API (STK Push & Callback routing)
* **Tunneling & Deployment:** Ngrok for local webhook and payment callback testing



## Project Directory Structure

text
C:\Web\
│
├── index.html            # Main landing page & entry point
├── buy.html              # Marketplace and M-Pesa checkout interface
├── book.html             # Training and service booking interface
├── about.html            # About the platform and mission
├── login.html            # User login portal
├── signup.html           # User registration portal
├── server.js             # Express backend server & M-Pesa integration logic
├── package.json          # Node.js dependencies and scripts
├── package-lock.json     # Locked dependency versions
├── style.css             # Core application styles and UI layout rules
└── [Image & Asset files] # Dog breed imagery, logos, and UI graphics



## Installation & Local Setup

### 1. Prerequisites

Ensure you have the following installed on your machine:

* [Node.js](https://nodejs.org/) (v16 or higher)
* [PostgreSQL](https://www.postgresql.org/)
* [Ngrok](https://ngrok.com/) (for local M-Pesa callback handling)

### 2. Database Configuration

1. Open your PostgreSQL terminal or pgAdmin and create a database named `bosco_k9`:
```sql
CREATE DATABASE bosco_k9;




2. Verify your database connection credentials inside `server.js`:
```javascript
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'your_password',
    database: 'bosco_k9' 
});





### 3. Install Dependencies

Navigate to your project directory and install the required Node modules:

```cmd
cd C:\Web
npm install

```

### 4. Running the Application

1. Start the backend server:
```cmd
node server.js

```


*The server will start on `http://localhost:3000` and confirm connection to the PostgreSQL database.*
2. Start your ngrok tunnel to handle M-Pesa callbacks:
```cmd
ngrok http 3000

```


3. Copy your active ngrok HTTPS forwarding URL (e.g., `[https://xxxx.ngrok-free.dev](https://xxxx.ngrok-free.dev)`) and update the `CallBackURL` property inside your `server.js` file under the `/api/purchase` route:
```javascript
CallBackURL: 'https://xxxx.ngrok-free.dev/api/mpesa/callback',

```



---

## Usage

* **Open Locally:** Navigate to `http://localhost:3000/index.html` in your web browser.
* **Access Online Tunnel:** Use your active ngrok URL (`[https://xxxx.ngrok-free.dev/index.html](https://xxxx.ngrok-free.dev/index.html)`) to test live features and trigger simulated M-Pesa STK push prompts directly to mobile devices.
