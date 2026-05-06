import { AppBar, Box, Container, Toolbar, Typography } from "@mui/material"
import { useEffect } from "react"
import MyThemeProvider, { localStorageDarkModeKey } from "./components/ThemeProvider"
import { uiStates } from "./components/uiStates"
import { useMyThemeProviderContext } from "./components/useMyThemeProviderContext"
import { useLocalStorage } from "@uidotdev/usehooks"
const appbarStateKey = "hide-appbar"

const appBarStates = Object.freeze({
    hided: "1",
    showed: "0"
})

export default function RootComponent({children}: any) {
    
    return (
        <MyThemeProvider>
            <Layout>
                {children}
            </Layout>
        </MyThemeProvider>
    )
}

function Layout({children}: any) {
    const { setDark } = useMyThemeProviderContext()
    const [appbarState, setAppbarState] = useLocalStorage(appbarStateKey, appBarStates.showed)
    useEffect(() => {
        if ((window as any).javaApp) {
            (window as any).javaApp.printMessage("Hola mundoooo");
        }
        if ((window as any).flutter_inappwebview) {
            localStorage.setItem('hide-appbar', appBarStates.hided)
            setAppbarState(appBarStates.hided as any)

            window.addEventListener('toggleDark', (event: any) => {
                const isDark = event.detail.dark == uiStates.dark
                setDark(isDark)
                localStorage.setItem(localStorageDarkModeKey, isDark ? uiStates.dark : uiStates.light)
            })
        }
    }, [])

    return (
        <Box sx={{ flexGrow: 1 }}>
            {appbarState == appBarStates.showed && <AppBar position="static" elevation={0}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Snippet editor
                    </Typography>
                </Toolbar>
            </AppBar>}

            <Container>
                {children}
            </Container>
        </Box>
    );
}