import { createContext, useContext, useState } from "react";

const IconContext = createContext();

export const IconProvider = ({ children, iconSize }) => {
  const [size, setSize] = useState(iconSize);

  return (
    <IconContext.Provider value={{ size, setSize }}>
      {children}
    </IconContext.Provider>
  );
};

export const useIcon = () => useContext(IconContext);
