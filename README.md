# Our Voice, Our Rights - MGNREGA Data Visualization

## Project Overview
A user-friendly web application to make MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) performance data accessible to rural Indian citizens. The application focuses on simplifying complex government data and presenting it in an intuitive, easy-to-understand format.

## Features
- 🌐 Multilingual support for major Indian languages
- 📱 Mobile-first, responsive design
- 🗺️ Automatic district detection using geolocation
- 📊 Simple visual representations of district performance
- 📈 Historical data comparison
- 🔄 Offline support with data caching
- 🚀 Production-ready architecture

## Technical Stack
- **Frontend**: Next.js 14 with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB for data caching and analytics
- **Caching**: Redis for API response caching
- **Deployment**: Docker containerization
- **Hosting**: Digital Ocean / AWS
- **CI/CD**: GitHub Actions
- **Monitoring**: Grafana + Prometheus

## Architecture Decisions

### 1. Data Management
- Regular scheduled sync with data.gov.in API
- Local cache in MongoDB for fast retrieval
- Redis layer for API response caching
- Fallback data for API downtime

### 2. User Interface
- Progressive Web App (PWA) for offline access
- Simple, icon-based navigation
- Voice support for low-literacy users
- Visual comparisons using charts and graphs
- Support for slow internet connections

### 3. Performance
- Static page generation for fast loading
- Image optimization and lazy loading
- Edge caching with CDN
- Minimal JavaScript payload

### 4. Monitoring
- Real-time performance monitoring
- Error tracking and reporting
- Usage analytics for improvements
- API health checks

## Project Structure
```
/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Next.js pages and API routes
│   ├── lib/           # Utility functions and helpers
│   ├── models/        # Database models
│   ├── services/      # Business logic and external services
│   ├── hooks/         # Custom React hooks
│   └── types/         # TypeScript type definitions
├── public/           # Static assets
├── locales/         # Translation files
├── scripts/         # Build and deployment scripts
└── tests/           # Test suites
```

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Start development server: `npm run dev`

## Environment Variables
Create a `.env` file with:
```
MONGODB_URI=your_mongodb_uri
REDIS_URL=your_redis_url
DATA_GOV_API_KEY=your_api_key
```

## Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Deployment
The application is containerized using Docker and can be deployed to any cloud provider. Deployment scripts and instructions are included in the `/scripts` directory.

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.