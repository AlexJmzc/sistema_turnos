import React, { createContext, useContext, useEffect, useState } from 'react';

const ValueContext = createContext();

export const ValueProvider = ({ children }) => {
    const [selectedValue, setSelectedValue] = useState(localStorage.getItem('Sucursal' || ''));
  
    useEffect(() => {
      localStorage.setItem('Sucursal', selectedValue);
    })
    
    return (
      <ValueContext.Provider value={{ selectedValue, setSelectedValue }}>
        {children}
      </ValueContext.Provider>
    );
};

export const useValue = () => useContext(ValueContext);