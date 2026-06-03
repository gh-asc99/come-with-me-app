import React from 'react';
import ReactCountryFlag from "react-country-flag";
import useLanguage from '../../hooks/useLanguage.js';

const LanguageSelector = () => {
    const { currentLang, changeLanguage, languages, currentLanguage } = useLanguage();

    return (
        <div className="relative group">
            <button
                className="flex items-center justify-center p-2 rounded-lg hover:bg-white/10 active:bg-white/20 transition-all border border-transparent hover:border-white/20"
                title={currentLanguage?.label || "Cambiar idioma"}
            >
                <ReactCountryFlag
                    countryCode={currentLanguage?.country}
                    svg
                    style={{
                        width: '1.4em',
                        height: '1.4em',
                    }}
                />
            </button>

            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 py-1.5 z-50 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full px-3 py-2 flex items-center gap-3 transition-all text-left text-sm
                        ${currentLang === lang.code
                                ? 'bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 font-semibold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            }`}
                    >
                        <ReactCountryFlag
                            countryCode={lang.country}
                            svg
                            style={{
                                width: '1.2em',
                                height: '1.2em',
                            }}
                        />

                        <span className="truncate">{lang.label}</span>

                        {currentLang === lang.code && (
                            <span className="ml-auto text-primary-600 dark:text-primary-400 font-bold">✓</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LanguageSelector;