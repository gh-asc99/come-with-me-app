import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const ContextoLanguage = createContext();

const ProveedorLanguage = ({ children }) => {
    const { i18n } = useTranslation();

    const [currentLang, setCurrentLang] = useState('es');

    useEffect(() => {
        const savedLang = localStorage.getItem('language')  i18n.language  'es';
        i18n.changeLanguage(savedLang);
        setCurrentLang(savedLang);
    }, [i18n]);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        setCurrentLang(lang);
        localStorage.setItem('language', lang);
    };

    const languages = [
        { code: 'es', country: 'ES', label: 'Español' },
        { code: 'en', country: 'GB', label: 'English' }
    ];

    const currentLanguage = languages.find(l => l.code === currentLang);

    return (
        <language.Provider value={{ currentLang, changeLanguage, languages, currentLanguage }}>
            {children}
        </language.Provider>
    );
};

export default ProveedorLanguage;

export {ContextoLanguage};