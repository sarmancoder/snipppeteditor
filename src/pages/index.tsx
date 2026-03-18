import { Link } from 'react-router'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
export default function index() {
    return (
        <div>
            <Typography variant="h3" color="initial">Snippets editor</Typography>
            <Button variant="text" color="primary" component={Link as any} to="/app">
                Ir a la app
            </Button>
        </div>
    )
}
