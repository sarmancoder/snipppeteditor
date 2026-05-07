import { Box, colors, Toolbar, Typography, Button } from '@mui/material'
import { drawerWidth } from '../constants'
import { useAppContext } from '../hooks/useAppContext'
import useFS from '../hooks/useFs'

export default function PwaDrawer() {
    const {leerDirectorio} = useFS()
    const {isPWA} = useAppContext()

    if (isPWA) return (<Box />)

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            background: colors.grey[200],
            width: drawerWidth,
            zIndex: (theme) => theme.zIndex.appBar - 1
        }}>
            <Toolbar />
            <Box sx={{ p: 1 }}>
                <Typography variant="h5" color="initial">drawer</Typography>
                <Button variant="contained" color="primary" onClick={leerDirectorio}>
                    Leer directorio
                </Button>
            </Box>
        </Box>
    )
}
