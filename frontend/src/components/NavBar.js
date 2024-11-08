import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ userRole }) => (
    <nav>
        {userRole === 'admin' && (
            <>
                <Link to="/departments">部门管理</Link>
                <Link to="/users">用户管理</Link>
            </>
        )}
        {userRole === 'user' && (
            <Link to="/profile">个人信息</Link>
        )}
    </nav>
);

export default NavBar;
