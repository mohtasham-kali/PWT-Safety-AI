# SaaS 2.0 Tri-Stack Platform

## Architecture
- **Web Dashboard**: Next.js 14+ (React)
- **Backend API**: NestJS
- **AI Services**: Python (FastAPI)
- **Analytics Engine**: Rust

## Setup
### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.11+
- Rust 1.70+

### Running the Stack
1. Start Infrastructure:
   ```bash
   docker-compose up -d
   ```

2. Start Web Dashboard:
   ```bash
   cd web-dashboard
   npm run dev
   ```

3. Start Backend API:
   ```bash
   cd backend-api
   npm run start:dev
   ```

4. Start AI Service:
   ```bash
   cd ai-services
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

5. Start Analytics Engine:
   ```bash
   cd analytics-engine
   cargo run
   ```
