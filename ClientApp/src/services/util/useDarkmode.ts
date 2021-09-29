import { useEffect, useState } from "react";

// https://css-tricks.com/a-dark-mode-toggle-with-react-and-themeprovider/

export enum DarkmodeStates {
    LIGHT = 'light',
    DARK = 'dark',
}

export const useDarkmode = (): [DarkmodeStates, (mode: DarkmodeStates) => void, boolean] => {
    const [theme, setTheme] = useState(DarkmodeStates.LIGHT);
    const [mounted, setMounted] = useState(false);

    const setMode = (mode: DarkmodeStates): void => {
        localStorage.setItem('theme', mode);
        setTheme(mode);
    };

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') === DarkmodeStates.LIGHT ? 
            DarkmodeStates.LIGHT : DarkmodeStates.DARK;

        matchMedia('(prefers-color-scheme: dark)').matches && !storedTheme ?
            setMode(DarkmodeStates.DARK) : 
            storedTheme ?
                setTheme(storedTheme) : setMode(DarkmodeStates.LIGHT);
        setMounted(true);
    }, []);

    return [theme, setMode, mounted];
}