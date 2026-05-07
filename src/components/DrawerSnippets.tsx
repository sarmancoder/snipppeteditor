import { Box, colors, Toolbar, Typography } from '@mui/material'
import { drawerWidth } from '../constants'
import { useAppContext } from '../hooks/useAppContext'

export default function DrawerSnippets() {
    const { isPWA } = useAppContext()

    if (isPWA) return (<Box />)

    return (
        <Box sx={{
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            background: colors.grey[200],
            width: drawerWidth,
            zIndex: (theme) => theme.zIndex.appBar - 1
        }}>
            <Toolbar />
            <Typography variant="body1" color="initial">snippetss</Typography>
        </Box>
    )
}
