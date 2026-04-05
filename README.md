# LMS Backend

A Learning Management System backend built with Node.js, Express, and MongoDB.

## Installation

```bash
npm install
```

## Development

```bash
# Start development server with auto-reload
npm run dev
```

## Build & Production

```bash
# Build the project (currently JavaScript - ready for TypeScript migration)
npm run build

# Build TypeScript (when you migrate to .ts files)
npm run build:ts

# Build and watch for TypeScript changes
npm run build:watch

# Clean build artifacts
npm run clean

# Build and start production server
npm run serve
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build for deployment (currently JavaScript)
- `npm run build:ts` - Compile TypeScript (for future .ts migration)
- `npm run build:watch` - Compile TypeScript and watch for changes
- `npm run clean` - Remove build artifacts
- `npm run serve` - Build and start production server
- `npm test` - Run tests (not implemented)

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

## TypeScript Support

This project is configured for TypeScript with type definitions already installed. To migrate from JavaScript to TypeScript:

1. Rename `.js` files to `.ts`
2. Update imports to use TypeScript syntax
3. Use `npm run build:ts` instead of `npm run build`
4. The TypeScript configuration is ready in `tsconfig.json`

## Project Structure

```
├── Controller/          # Route controllers
├── Middleware/          # Custom middleware
├── Model/              # Mongoose models
├── Routes/             # API routes
├── Cloudinary/         # Cloudinary configuration
├── Nodemailer/         # Email configuration
├── multer/             # File upload configuration
├── scripts/            # Utility scripts
├── uploads/            # Uploaded files
├── index.js            # Main application entry point
├── db.js               # Database connection
└── package.json        # Dependencies and scripts
```