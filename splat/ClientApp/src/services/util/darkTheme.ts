import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#fff59d',
            light: '#ffffcf',
            dark: '#cbc26d'
        },
        secondary: {
            main: '#bdbdbd',
            light: '#efefef',
            dark: '#8d8d8d'
        },
        text: {
            primary: '#fffde7'
        }
    },
});

export default darkTheme;