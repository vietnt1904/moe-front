import { useLocalStorage } from "@mantine/hooks";
import { createContext } from "react";

export const ThemeContext = createContext();
// eslint-disable-next-line react/prop-types
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage({
    key: "app-theme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>
        {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
