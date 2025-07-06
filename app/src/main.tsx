import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PrivyProvider } from '@privy-io/react-auth';
import App from './App.tsx';
import './index.css';
import { NexusProvider } from '@avail-project/nexus';
import {arbitrumSepolia, baseSepolia, optimismSepolia, sepolia, base, optimism, arbitrum} from 'viem/chains';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId="cm6qt4wko001l64rpni0xtoo6"
      config={{
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'
          }
        },
        defaultChain: baseSepolia,
        supportedChains: [base, optimism, baseSepolia, sepolia, optimismSepolia, arbitrumSepolia, arbitrum],
        appearance: {
          theme: 'dark',
          accentColor: '#6366f1',
          logo: 'https://raw.githubusercontent.com/Podima2/NexusFund/main/app/public/logo.png',
        },
      }}
    >
        <App />
      
    </PrivyProvider>
  </StrictMode>
);
