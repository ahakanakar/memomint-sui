import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { getFullnodeUrl } from '@mysten/sui/client'
import App from './App.jsx'
import './index.css'
import '@mysten/dapp-kit/dist/index.css'

// Create a QueryClient instance for React Query
const queryClient = new QueryClient()

// Configure Sui network - using Devnet for development
const networks = {
  devnet: { url: getFullnodeUrl('devnet') },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="devnet">
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)

