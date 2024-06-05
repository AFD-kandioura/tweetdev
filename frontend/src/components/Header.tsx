import "../styles/Header.css"
import { useAuth } from '../provider/AuthProvider';

function Header() {
    const { isLoggedIn } = useAuth();

    return (
        <div>
        <header className="header">
            <div className="header_logo">
                <a className="header_logo-link" href="/">
                    TweetDev
                </a>
            </div>
            <nav className="header_navbar">
                <ul className="header_nav-menu">

                <li className="header_nav-item"><a href="/feed" className="header_nav-link">Feed</a></li>
                    {!isLoggedIn && (
                <>
                  <li className="header_nav-item"><a href="/codeEditor" className="header_nav-link">Editeur</a></li>
                  <li className="header_nav-item"><a href="/login" className="header_nav-link">Login</a></li>
                  <li className="header_nav-item"><a href="/signup" className="header_nav-link">Sign up</a></li>
                </>
            )}

                {isLoggedIn && (
                    <>
                    <li className="header_nav-item">
                        <a href="/profile" className="header_nav-link" >Profile</a>
                    </li>
                    <li className="header_nav-item">
                        <a href="/logout" className="header_nav-link" >Log Out</a>
                    </li>
                    </>
                )}
                </ul>
            </nav>
        </header>
        </div>
    );
}

export default Header;
