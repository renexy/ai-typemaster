/**
 * @component UpProvider
 * @description Context provider that manages Universal Profile (UP) wallet connections and state
 * for LUKSO blockchain interactions on Grid. It handles wallet connection status, account management, and chain
 * information while providing real-time updates through event listeners.
 *
 * @provides {UpProviderContext} Context containing:
 * - provider: UP-specific wallet provider instance
 * - client: Viem wallet client for blockchain interactions
 * - chainId: Current blockchain network ID
 * - accounts: Array of connected wallet addresses
 * - contextAccounts: Array of Universal Profile accounts
 * - walletConnected: Boolean indicating active wallet connection
 * - selectedAddress: Currently selected address for transactions
 * - isSearching: Loading state indicator
 * - ready: Boolean indicating if the provider is ready
 */

import { createClientUPProvider } from "@lukso/up-provider";
import { createWalletClient, custom } from "viem";
import { lukso, luksoTestnet } from "viem/chains";
import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";

interface UpProviderContext {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  provider: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any;
  chainId: number;
  accounts: Array<`0x${string}`>;
  contextAccounts: Array<`0x${string}`>;
  walletConnected: boolean;
  selectedAddress: `0x${string}` | null;
  setSelectedAddress: (address: `0x${string}` | null) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  ready: boolean;
}

const UpContext = createContext<UpProviderContext | undefined>(undefined);

const provider = typeof window !== "undefined" ? createClientUPProvider() : null;

// eslint-disable-next-line react-refresh/only-export-components
export function useUpProvider() {
  const context = useContext(UpContext);
  if (!context) {
    throw new Error("useUpProvider must be used within a UpProvider");
  }
  return context;
}

interface UpProviderProps {
  children: ReactNode;
}

export function UpProvider({ children }: UpProviderProps) {
  const [chainId, setChainId] = useState<number>(0);
  const [accounts, setAccounts] = useState<Array<`0x${string}`>>([]);
  const [contextAccounts, setContextAccounts] = useState<Array<`0x${string}`>>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<`0x${string}` | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [ready, setReady] = useState(false);

  // Memoize client creation to prevent unnecessary re-renders
  const client = useMemo(() => {
    if (provider && chainId) {
      return createWalletClient({
        chain: chainId === 42 ? lukso : luksoTestnet,
        transport: custom(provider),
      });
    }
    return null;
  }, [chainId]);

  useEffect(() => {
    setReady(false);
    let mounted = true;

    async function init() {
      try {
        if (!client || !provider) return;

        // Batch state updates
        const updates = await Promise.all([
          client.getChainId(),
          client.getAddresses(),
        ]);

        if (!mounted) return;

        const [_chainId, _accounts] = updates;
        const _contextAccounts = provider.contextAccounts;

        // Update state in one render cycle
        setChainId(_chainId as number);
        setAccounts(_accounts as Array<`0x${string}`>);
        setContextAccounts(_contextAccounts);
        setWalletConnected(_accounts.length > 0 && _contextAccounts.length > 0);
        setReady(true);

      } catch (error) {
        console.error(error);
        setReady(true);
      }
    }

    init();

    if (provider) {
      const handleUpdates = (
        type: 'accounts' | 'context' | 'chain',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: any
      ) => {
        if (!mounted) return;
        
        switch (type) {
          case 'accounts':
            setAccounts(value);
            setWalletConnected(value.length > 0 && contextAccounts.length > 0);
            break;
          case 'context':
            setContextAccounts(value);
            setWalletConnected(accounts.length > 0 && value.length > 0);
            break;
          case 'chain':
            setChainId(value);
            break;
        }
      };

      provider.on("accountsChanged", 
        (accs: Array<`0x${string}`>) => handleUpdates('accounts', accs)
      );
      provider.on("chainChanged", 
        (chain: number) => handleUpdates('chain', chain)
      );
      provider.on("contextAccountsChanged", 
        (accs: Array<`0x${string}`>) => handleUpdates('context', accs)
      );

      return () => {
        mounted = false;
        provider.removeAllListeners();
      };
    }
  }, [accounts.length, client, contextAccounts.length]); // Removed dependencies that might cause frequent re-renders

  const value = useMemo(() => ({
    provider,
    client,
    chainId,
    accounts,
    contextAccounts,
    walletConnected,
    selectedAddress,
    setSelectedAddress,
    isSearching,
    setIsSearching,
    ready,
  }), [
    chainId,
    accounts,
    contextAccounts,
    walletConnected,
    selectedAddress,
    isSearching,
    client,
    ready,
  ]);

  return (
    <UpContext.Provider value={value}>
      {children}
    </UpContext.Provider>
  );
} 