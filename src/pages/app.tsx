import { Box } from '@mui/material'
import DualEditorPage from '../components/DualEditorPage'
import AppEditorProvider from '../hooks/useAppContext'

export default function app() {
  return (
    <AppEditorProvider>
      <Box sx={{py: 5}}>
        <DualEditorPage />
      </Box>
    </AppEditorProvider>
  )
}
