import React, { createContext, useContext, useState } from 'react';

const ValueContext = createContext();

export const ValueProvider = ({ children }) => {
    const [selectedValue, setSelectedValue] = useState('Ninguna');
  
    return (
      <ValueContext.Provider value={{ selectedValue, setSelectedValue }}>
        {children}
      </ValueContext.Provider>
    );
};

export const useValue = () => useContext(ValueContext);