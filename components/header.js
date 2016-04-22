import React from 'react';

const Header = ()=>{
    return (
        <header>
            <nav className="orange darken-1">
                <div className="container">
                    <div className="nav-wrapper">
                        <a href="/" className="brand-logo">
                            <div className='hnLogo left'>
                                Y
                            </div>
                            Hacker news
                        </a>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
