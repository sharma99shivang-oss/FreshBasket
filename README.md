# FreshBasket

A mobile-first grocery delivery starter built with React 19, Vite, Tailwind CSS v4, Express, MongoDB, Mongoose, and Redux Toolkit.

## Features

- Responsive grocery catalogue with category filtering and search
- Redux-powered cart with persistent local storage
- Express MVC API with validation, security middleware, and centralized error handling
- MongoDB product model plus a repeatable seed command
- ES modules throughout, ESLint, Prettier, and concurrent development scripts

## Prerequisites

- Node.js 20.19+ (or 22.12+)
- MongoDB 7+ running locally, or a MongoDB Atlas connection string

## Installation

```bash
npm run install:all
Copy-Item server/.env.example server/.env
```

Set `MONGODB_URI` in `server/.env`, then seed the catalogue and start both apps:

```bash
npm run seed --prefix server
npm run dev
```

The frontend runs at `http://localhost:5173`; the API runs at `http://localhost:5000`.

For authentication, configure `JWT_SECRET` and a separate `JWT_REFRESH_SECRET`. In production, set `NODE_ENV=production`, use HTTPS, and configure the SMTP settings in `server/.env` so password reset emails can be delivered. In development, the forgot-password API includes a temporary reset token in its response for local testing.

## Commands

```bash
npm run dev       # start client and API concurrently
npm run build     # build the frontend
npm run lint      # lint both workspaces
npm run format    # format project files
```

## Project structure

```text
client/  React application: pages, components, hooks, Redux slices, services
server/  Express MVC API: controllers, models, routes, middleware, config
```

## API

`GET /api/health` returns service status.

`GET /api/products?category=Fruits&search=apple` lists products.

`GET /api/products/:id` returns one product.

`POST /api/auth/register`, `/login`, `/logout`, and `/refresh` manage cookie-backed sessions. `GET /api/auth/me` requires an `Authorization: Bearer <access-token>` header. Password reset endpoints are `/api/auth/forgot-password` and `/api/auth/reset-password/:token`.

For production, set `NODE_ENV=production`, restrict `CLIENT_URL`, and use managed MongoDB credentials.
