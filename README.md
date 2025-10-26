# MemoMint - AI Journal NFTs on Sui

MemoMint is a decentralized journaling application that combines AI-powered sentiment analysis with NFT minting on the Sui blockchain. Write your daily reflections, get insights, and preserve your memories as unique digital collectibles.

## Features

- 🔐 **zkLogin Integration**: Secure authentication using Sui's zkLogin
- 📝 **Journal Entries**: Write and store your daily thoughts
- 🤖 **AI Sentiment Analysis**: Automated analysis categorizes entries as Victorious, Diligent, or Reflective
- 🎨 **NFT Minting**: Mint unique NFTs on Sui blockchain representing your journal moments
- 💎 **Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Sui Network (Devnet)
- **Authentication**: zkLogin via Enoki
- **Sui Libraries**:
  - `@mysten/sui` - Core Sui SDK
  - `@mysten/dapp-kit` - React components and hooks for Sui dApps
  - `@mysten/enoki` - zkLogin integration
- **State Management**: React Query (@tanstack/react-query)

## Project Structure

```
memomint-sui/
├── src/
│   ├── components/
│   │   └── JournalInput.jsx      # Journal entry component
│   ├── utils/
│   │   └── aiAnalysis.js         # AI sentiment analysis logic
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # Application entry point with providers
│   └── index.css                 # Global styles with Tailwind
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd memomint-sui
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## How It Works

### 1. Sign In
Users authenticate using zkLogin, a privacy-preserving authentication method on Sui that doesn't require traditional wallet extensions.

### 2. Write Journal Entry
After signing in, users can write their daily journal entries in a clean, distraction-free interface.

### 3. AI Analysis
The built-in AI analyzer processes the journal entry and categorizes it based on keyword detection:
- **Victorious**: Achievement, success, and celebration
- **Diligent**: Hard work, learning, and progress
- **Reflective**: Contemplation, emotions, and introspection

### 4. Mint NFT
Each journal entry can be minted as a unique NFT on the Sui blockchain, creating a permanent, verifiable record of your journey.

## AI Sentiment Analysis

The sentiment analysis uses a keyword-based approach with three categories:

```javascript
analyzeJournal(entryText) => 'Victorious' | 'Diligent' | 'Reflective'
```

The function analyzes text for specific keywords associated with each sentiment and returns the dominant category.

## Development Status

### ✅ Completed (MVP Ready!)
- Project scaffolding with React + Vite ✅
- Tailwind CSS integration ✅
- Sui provider setup (Devnet) ✅
- AI sentiment analysis logic (3 categories) ✅
- Modern UI/UX with full responsive design ✅
- zkLogin authentication (demo mode functional) ✅
- Complete journal entry component ✅
- NFT minting transaction logic ✅
- Error handling and user feedback ✅
- Explorer integration for transactions ✅

### 🚧 Final Step (In Progress)
- **Move contract deployment to Sui Devnet**
- Update Package ID in `src/utils/suiTransactions.js`
- Test with real blockchain transactions

### 📋 Future Enhancements
- Production zkLogin with real Google OAuth
- User dashboard with minted NFTs gallery
- NFT transfer functionality
- Social sharing features
- Advanced AI sentiment categories

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Network Configuration

Currently configured for **Sui Devnet**. The network configuration can be found in `src/main.jsx`:

```javascript
const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
}
```

## Contributing

This is a hackathon project. Feel free to fork and build upon it!

## License

MIT License - feel free to use this project as you wish.

## Acknowledgments

- Built on [Sui](https://sui.io/) blockchain
- Powered by [Mysten Labs](https://mystenlabs.com/) infrastructure
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Built with ❤️ for the Sui Hackathon**

