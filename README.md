# API Perf Tester

A full-stack web application for running API performance tests using k6, built with React, Tailwind CSS, and Node.js.

## Features

- **Frontend Dashboard**: Intuitive React interface with test configuration forms
- **k6 Integration**: Backend service that generates and executes k6 performance test scripts
- **Real-time Metrics**: Visual charts displaying response times, RPS, and error rates
- **Test Types**: Support for load, stress, and spike testing patterns
- **Docker Support**: Complete containerized setup with docker-compose

## Project info

**URL**: https://lovable.dev/projects/87a31cda-5920-4238-aa9f-ec7f7203f3b9

## Quick Start with Docker

The easiest way to run the complete application:

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Start both frontend and backend with Docker
docker-compose up --build

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:3001
```

## Local Development

### Frontend Only
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Install k6 (required for performance testing)
# On macOS
brew install k6

# On Ubuntu/Debian
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6

# Start backend server
npm run dev
```

## Usage

1. **Configure Test**: Fill in the test configuration form with:
   - Target URL
   - HTTP method (GET, POST, PUT, DELETE)
   - Headers and request body (for POST/PUT)
   - Virtual Users (VUs) and test duration
   - Test type (Load, Stress, or Spike)

2. **Run Test**: Click "Run Performance Test" to execute the k6 script

3. **View Results**: Analyze metrics including:
   - Response time trends
   - Requests per second (RPS)
   - Error rates and status codes
   - Performance summary statistics

## Architecture

- **Frontend**: React 18 + TypeScript + Tailwind CSS + Recharts
- **Backend**: Node.js + Express + k6 integration
- **Containerization**: Docker + docker-compose
- **Performance Testing**: k6 load testing tool

## API Endpoints

- `POST /api/run-test` - Execute performance test with k6
- `GET /api/health` - Health check endpoint

## How can I edit this code?

**Use Lovable** (Recommended)

Simply visit the [Lovable Project](https://lovable.dev/projects/87a31cda-5920-4238-aa9f-ec7f7203f3b9) and start prompting.

**Local Development**

Clone the repo and make changes locally. Pushed changes will be reflected in Lovable.

## Technologies

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui (component library)
- Recharts (data visualization)
- React Router (navigation)

**Backend:**
- Node.js + Express
- k6 (performance testing)
- Docker (containerization)

**Development:**
- ESLint (linting)
- Lovable (AI-powered development)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/87a31cda-5920-4238-aa9f-ec7f7203f3b9) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
