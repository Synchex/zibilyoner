/**
 * Balance Context
 * 
 * Manages player's total money balance with AsyncStorage persistence.
 * Symbol: ₿ (Bitcoin symbol for in-game currency)
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'zibilyoner_balance';

interface BalanceContextType {
    balance: number;
    addBalance: (amount: number) => void;
    resetBalance: () => void;
    isLoading: boolean;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

interface BalanceProviderProps {
    children: ReactNode;
}

export function BalanceProvider({ children }: BalanceProviderProps) {
    const [balance, setBalance] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Load balance from AsyncStorage on mount
    useEffect(() => {
        loadBalance();
    }, []);

    const loadBalance = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored !== null) {
                setBalance(parseInt(stored, 10) || 0);
            }
        } catch (error) {
            console.error('[BalanceContext] Failed to load balance:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const saveBalance = async (newBalance: number) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, String(newBalance));
        } catch (error) {
            console.error('[BalanceContext] Failed to save balance:', error);
        }
    };

    const addBalance = useCallback((amount: number) => {
        setBalance(prev => {
            const newBalance = prev + amount;
            saveBalance(newBalance);
            return newBalance;
        });
    }, []);

    const resetBalance = useCallback(() => {
        setBalance(0);
        saveBalance(0);
    }, []);

    return (
        <BalanceContext.Provider value={{ balance, addBalance, resetBalance, isLoading }}>
            {children}
        </BalanceContext.Provider>
    );
}

export function useBalance(): BalanceContextType {
    const context = useContext(BalanceContext);
    if (!context) {
        throw new Error('useBalance must be used within a BalanceProvider');
    }
    return context;
}
