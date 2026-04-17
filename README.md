# LMS Backend

A Learning Management System backend built with Node.js, Express, and MongoDB.

## Installation Methods

You can run this project either manually (on your local machine) or using Docker.

### Prerequisites

- **Manual Installation:**
  - [Node.js](https://nodejs.org/) (v18 or higher recommended)
  - [npm](https://www.npmjs.com/)
  - [MongoDB](https://www.mongodb.com/) (if not using Docker)
- **Docker Installation:**
  - [Docker](https://www.docker.com/products/docker-desktop) (latest version)
  - [Docker Compose](https://docs.docker.com/compose/) (v2+)

---

## Manual Installation

1. **Clone the repository:**
	```bash
	git clone <repo-url>
	cd LMS
	```
2. **Install dependencies:**
	```bash
	npm install
	```
3. **Set up your environment variables:**
	- Copy the example from below and create a `.env` file in the root directory.
4. **Start MongoDB:**
	- Make sure MongoDB is running locally (default: `mongodb://localhost:27017`).
5. **Start the development server:**
	```bash
	npm run dev
	```

---

## Docker Installation

1. **Ensure Docker and Docker Compose are installed.**
2. **Build and start the containers:**
	```bash
	docker compose up --build
	```
	This will start both the backend server and a MongoDB instance.
3. **Environment Variables:**
	- You can set environment variables in a `.env` file (Docker will use them if configured in the Dockerfile or docker-compose.yml).
4. **Access the backend:**
	- The backend will be available at `http://localhost:3000`.

---


## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

