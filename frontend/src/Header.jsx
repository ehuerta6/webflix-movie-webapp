import './Header.css';
import profilePic from './assets/profile-pic.jpg';

function Header() {
  return (
    <header className='site-header'>
      <h1 className='logo'>WEBFLIX</h1>
      <nav className='nav-menu'>
        <button className='nav-button'>Home</button>
        <button className='nav-button'>Movies</button>
        <button className='nav-button'>Shows</button>
        <button className='nav-button'>Search</button>
        <button className='profile-button'>
          <img src={profilePic} alt='Profile' className='profile-picture' />
        </button>
      </nav>
    </header>
  );
}

export default Header;
