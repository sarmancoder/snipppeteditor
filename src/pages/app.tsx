import { Box, Toolbar } from '@mui/material'
import DualEditorPage from '../components/DualEditorPage'
import AppEditorProvider from '../hooks/useAppContext'
import { drawerWidth } from '../constants'
import DrawerFiles from '../components/DrawerFiles'
import DrawerSnippets from '../components/DrawerSnippets'
import FSProvider from '../hooks/useFSContext'

export default function app() {
  return (
    <AppEditorProvider>
      <FSProvider>
        <Box sx={{py: 5}}>
          <DrawerFiles />
          <DrawerSnippets />
          <Box sx={{position: 'absolute', left: drawerWidth, right: drawerWidth, top: 0}}>
            <Toolbar />
            <Box sx={{p: 1}}>
              <DualEditorPage />
            </Box>
          </Box>
        </Box>
      </FSProvider>
    </AppEditorProvider>
  )
}
