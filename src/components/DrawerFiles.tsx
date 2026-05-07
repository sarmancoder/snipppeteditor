import { Folder } from '@mui/icons-material'
import { Box, colors, IconButton, List, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material'
import { useState } from 'react'
import { drawerWidth, fileExtension } from '../constants'
import { useAppContext } from '../hooks/useAppContext'
import fileManager from '../utils/fs'

export default function FilesDrawer() {
    const [dirName, setDirName] = useState('')
    const [files, setFiles] = useState<Awaited<ReturnType<typeof fileManager['listFiles']>>>([])

    const { isPWA } = useAppContext()

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
                <IconButton onClick={async () => {
                    const name = await fileManager.selectDirectory()
                    if (!name) return
                    setDirName(name)
                    const files = await fileManager.listFiles()
                    setFiles(files)
                }}>
                    <Folder />
                </IconButton>
                <Typography variant="body1" color="initial">{dirName}</Typography>
            </Box>
            <Box>
                <List>
                    {files.map((item) => <ListItemButton key={item.name}>
                        <ListItemText primary={item.name.replace('.' + fileExtension, '')} />
                    </ListItemButton>)}
                </List>
            </Box>
        </Box>
    )
}
