import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffee58',
            light: '#ffff8b',
            dark: '#c9bc1f'
        },
        secondary: {
            main: '#212121',
            light: '#484848',
            dark: '#000000'
        },
    },
});

export default theme;