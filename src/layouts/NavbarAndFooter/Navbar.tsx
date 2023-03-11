import { useOktaAuth } from '@okta/okta-react';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Spinner from '../Utils/Spinner';

const Navbar: React.FC = () => {
  const { oktaAuth, authState } = useOktaAuth();

  if (!authState) {
    return <Spinner />;
  }

  const handleLogout = async () => oktaAuth.signOut();

  return (
    <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
      <div className='container-fluid'>
        <span className='navbar-brand'>© BookHive TR</span>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNavDropdown'
          aria-controls='navbarNavDropdown'
          aria-expanded='false'
          aria-label='Toggle Navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNavDropdown'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink to='/home' className='nav-link'>
                Home
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to='/search' className='nav-link'>
                Search Books
              </NavLink>
            </li>
          </ul>
          <ul className='navbar-nav ms-auto'>
            {!authState.isAuthenticated ? (
              <li className='nav-item m-1'>
                <Link
                  type='button'
                  className='btn btn-outline-light'
                  to='/login'
                >
                  Sign in
                </Link>
              </li>
            ) : (
              <li>
                <button
                  className='btn btn-outline-light'
                  onClick={() => handleLogout()}
                >
                  Log out
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
