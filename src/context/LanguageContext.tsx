import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../data/translations';

const STORAGE_KEY_LANGUAGE = 'appLanguage';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('tr');
    const [isLoading, setIsLoading] = useState(true);

    // Load language from storage on mount
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY_LANGUAGE)
            .then(storedLang => {
                if (storedLang === 'en' || storedLang === 'tr') {
                    setLanguageState(storedLang);
                }
            })
            .catch(err => {
                console.error('Failed to load language:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    // Setter that also persists to storage
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        AsyncStorage.setItem(STORAGE_KEY_LANGUAGE, lang).catch(err => {
            console.error('Failed to save language:', err);
        });
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, isLoading }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
