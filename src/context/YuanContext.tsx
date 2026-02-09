import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_YUAN = 'totalYuan';

interface YuanContextType {
    totalYuan: number;
    runYuan: number;
    isLoading: boolean;
    addYuan: (amount: number) => void;
    resetRunYuan: () => void;
    resetYuan: () => void;
}

const YuanContext = createContext<YuanContextType | undefined>(undefined);

export function YuanProvider({ children }: { children: ReactNode }) {
    const [totalYuan, setTotalYuan] = useState<number>(0);
    const [runYuan, setRunYuan] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Initialize totalYuan from AsyncStorage
    useEffect(() => {
        const initYuan = async () => {
            try {
                const storedYuan = await AsyncStorage.getItem(STORAGE_KEY_YUAN);
                if (storedYuan) {
                    setTotalYuan(parseInt(storedYuan, 10));
                }
            } catch (error) {
                console.error('Failed to load yuan:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initYuan();
    }, []);

    const addYuan = (amount: number): void => {
        const newTotal = totalYuan + amount;
        setTotalYuan(newTotal);
        setRunYuan(prev => prev + amount);
        AsyncStorage.setItem(STORAGE_KEY_YUAN, String(newTotal));
    };

    const resetRunYuan = (): void => {
        setRunYuan(0);
    };

    // DEV: Reset total yuan to 0
    const resetYuan = (): void => {
        setTotalYuan(0);
        setRunYuan(0);
        AsyncStorage.setItem(STORAGE_KEY_YUAN, '0');
    };

    return (
        <YuanContext.Provider
            value={{
                totalYuan,
                runYuan,
                isLoading,
                addYuan,
                resetRunYuan,
                resetYuan,
            }}
        >
            {children}
        </YuanContext.Provider>
    );
}

export function useYuan() {
    const context = useContext(YuanContext);
    if (context === undefined) {
        throw new Error('useYuan must be used within a YuanProvider');
    }
    return context;
}
