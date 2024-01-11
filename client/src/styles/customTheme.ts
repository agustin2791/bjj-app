import { PaletteColorOptions, createTheme } from "@mui/material";


declare module '@mui/material/styles' {
    interface Palette {
        navBtn: PaletteColorOptions
    }

    interface PaletteOptions {
        navBtn?: PaletteColorOptions
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        navBtn: true;
    }
}

const theme = createTheme({
    palette: {
        navBtn: {
            main: '#eee',
            light: '#fff',
            dark: '#ddd',
            contrastText: '#333'
        }
    }
})
export default theme