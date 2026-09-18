# Blockchain-Based Crowdfunding Platform (DeFi)

Production-ready monorepo for a decentralized crowdfunding platform with:

- Next.js frontend (`client`)
- NestJS backend (`server`)
- Solidity + Hardhat smart contracts (`blockchain`)
- Shared TypeScript contracts (`shared`)
- Supabase for metadata and donation records
- MetaMask wallet integration

## Architecture

Frontend (Next.js + Ethers.js)  
-> Backend (NestJS + Supabase)  
-> Smart Contract (Hardhat / EVM)

Funds are managed on-chain by `Crowdfunding.sol`. Off-chain metadata and analytics are managed via the NestJS API and Supabase.

## Current Functionality

- Create campaigns on-chain from the client via MetaMask
- Persist campaign metadata in Supabase via NestJS
- Upload campaign images to Supabase Storage buckets
- Store donation records in Supabase after on-chain donate transactions
- View campaign list and campaign details with image previews

## Monorepo Structure

```txt
crowdfunding-dapp/
├── client/
├── server/
├── blockchain/
├── shared/
├── README.md
└── docker-compose.yml
```

## Prerequisites

- Node.js 20+
- npm 10+
- MetaMask browser extension
- Supabase project (URL + Service Role key)
- RPC URL and private key for deployment

## Environment Variables

### `blockchain/.env`

```env
SEPOLIA_RPC_URL=
PRIVATE_KEY=
ETHERSCAN_API_KEY=
```

### `server/.env`

```env
PORT=4000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=campaign-images
CLIENT_ORIGIN=http://localhost:3000
```

### `client/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_CONTRACT_ADDRESS=
```

## Supabase Setup

Run the initial migration before starting the app:

- `server/supabase/migrations/0001_init_schema.sql`

This migration creates:

- `users` table (wallet index and lowercase checks)
- `campaigns` table (on-chain id mapping + metadata + image URL)
- `donations` table (campaign relation + tx hash uniqueness)
- Supabase Storage bucket `campaign-images` (public)

If you use a different bucket name, set `SUPABASE_STORAGE_BUCKET` in `server/.env`.

Campaign image uploads are stored with a `campaigns/` prefix in the configured bucket.

## API Endpoints (Core)

- `POST /campaigns` create campaign metadata row
- `GET /campaigns` list campaign metadata rows
- `GET /campaigns/:id` get one campaign metadata row
- `POST /campaigns/upload-image` upload image file to Supabase Storage
- `POST /donations` store donation metadata row

## Run Order

1. Deploy contract:
   - `cd blockchain`
   - `npm install`
   - `npm run compile`
   - `npm run test`
   - `npm run deploy:sepolia`
2. Start backend:
   - `cd ../server`
   - `npm install`
   - `npm run start:dev`
3. Start frontend:
   - `cd ../client`
   - `npm install`
   - `npm run dev`

## API Docs

Swagger UI:

- `http://localhost:4000/api/docs`

## Security Notes

- Contract includes pull-based refunds and owner-only withdrawal checks.
- Backend validates payloads with class-validator.
- Never expose Supabase service role key in frontend.
- Image upload is proxied through backend; service role key stays server-side only.
