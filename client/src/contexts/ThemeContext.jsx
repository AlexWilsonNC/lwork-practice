import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider, createGlobalStyle } from 'styled-components';
import { lightTheme, darkTheme } from '../themes';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const GlobalStyle = createGlobalStyle`
  html, body {
    background-color: ${({ theme }) => theme.body};
  }
`

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(lightTheme);

    useEffect(() => {
        const isDarkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
        setTheme(isDarkModeEnabled ? darkTheme : lightTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === lightTheme ? darkTheme : lightTheme;
        setTheme(newTheme);
        localStorage.setItem('darkMode', newTheme === darkTheme ? 'enabled' : 'disabled');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <StyledThemeProvider theme={theme}>
                <GlobalStyle />
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};
