import { Box, colors, List, ListItemButton, ListItemText, Toolbar } from '@mui/material'
import { drawerWidth, fileExtension } from '../constants'
import { useAppContext } from '../hooks/useAppContext'
import { useFSContext } from '../hooks/useFSContext'

export default function DrawerSnippets() {
    const { isPWA } = useAppContext()
    const {snippets, activeSnippet, setActiveSnippet} = useFSContext()

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
            <Box>
                <List>
                    {snippets.map((item) => <ListItemButton key={item.key}
                        selected={item.key == activeSnippet}
                        onClick={() => setActiveSnippet(item.key)}
                    >
                        <ListItemText primary={item.prefix} secondary={item.description} />
                    </ListItemButton>)}
                </List>
            </Box>
        </Box>
    )
}
