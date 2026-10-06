import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                CRAVE.
            </Link>

            <div className="nav-links">
                <Link to="/">SEARCH</Link>
                <Link to="/discover">DISCOVER</Link>
            </div>
        </nav>
    )
}

export default Navbar