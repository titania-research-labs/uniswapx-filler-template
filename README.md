# UniswapX Filler Template

## Development Setup

To set up the development environment, follow these steps:

1. Install dependencies:
   ```
   pnpm install
   ```

2. Create a local environment file:
   ```
   cp .env.example .env
   ```

3. Fill in the required environment variables in the `.env` file. Make sure to provide valid values for all necessary fields.
   - `PRIVATE_KEY`: The private key of the wallet that will be used to fill an intent.
   - `ALCHEMY_API_KEY`: The Alchemy API key to use for interacting with the Arbitrum network.

   like this:
   ```
   PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
   ALCHEMY_API_KEY=abcdef1234567890abcdef123456-890
   ```
4. Start the development server:
   ```
   pnpm dev
   ```

After completing these steps, your development environment should be up and running. You can now begin working on the project locally.
