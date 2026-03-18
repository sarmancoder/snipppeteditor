import {Link} from 'react-router'
export default function index() {
    return (
        <div>
            <div>Pagina principal</div>
            <Link to="/app">Ir a app</Link>
        </div>
    )
}
