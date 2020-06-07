import React, { createContext, useReducer } from "react";
import { StateAction } from './state-action.interface';

interface ThemeContextProps {
    navBarStyle: "light" | "default";
    changeNavBarStyle: (newStyle: "light" | "default") => void;
};

const themeContextInitialState: ThemeContextProps = {
    navBarStyle: "default",
    changeNavBarStyle: () => null
}

const ThemeContext = createContext<ThemeContextProps>(themeContextInitialState);

const themeReducer = (state: ThemeContextProps, action: StateAction) => {
    switch (action.type) {
        // CAMBIA LO STILE DELLA BARRA DI NAVIGAZIONE
        case "CHANGE_NAVIGATION_STYLE":
            return { ...state, navBarStyle: action.payload }
        default:
            return state;
    }
}

const ThemeProvider = (props: any) => {
    const [state, dispatch] = useReducer(themeReducer, themeContextInitialState);

    // CAMBIA LO STILE DELLA BARRA DI NAVIGAZIONE
    const changeNavBarStyle = (newStyle: "light" | "default") =>
        dispatch({ type: "CHANGE_NAVIGATION_STYLE", payload: newStyle })

    return (
        <ThemeContext.Provider
            value={{ navBarStyle: state.navBarStyle, changeNavBarStyle }}
            {...props}
        />
    )
}

export { ThemeContext, ThemeProvider };