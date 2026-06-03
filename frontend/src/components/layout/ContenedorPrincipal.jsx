import React from 'react';

const ContenedorPrincipal = ({ children, className = "" }) => {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  );
};

export default ContenedorPrincipal;