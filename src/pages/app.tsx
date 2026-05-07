import { Box, Toolbar } from '@mui/material'
import DualEditorPage from '../components/DualEditorPage'
import AppEditorProvider from '../hooks/useAppContext'
import { drawerWidth } from '../constants'
import PwaDrawer from '../components/PwaDrawer'

export default function app() {
  return (
    <AppEditorProvider>
      <Box sx={{py: 5}}>
        <PwaDrawer />
        <Box sx={{position: 'absolute', left: drawerWidth, top: 0, right: 0}}>
          <Toolbar />
          <Box sx={{p: 1}}>
            <DualEditorPage />
          </Box>
        </Box>
      </Box>
    </AppEditorProvider>
  )
}
