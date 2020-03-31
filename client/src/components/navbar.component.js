import React, { useState } from 'react';
import { NavLink as ReactLink } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import logo from '../logo.ico';

// import { Context } from '../context.js';


export default function AppNavbar(){
    
    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => setCollapsed(!collapsed);
    const collapse = () => setCollapsed(true);

    return (
        <div>
        <Navbar className="navbar-expand-lg theme-navbar" dark>
            <NavbarBrand href="/" className="mr-auto align-middle pr-3">
                <img className="d-inline-block align-top mx-3" src={logo} width="40px" alt="logo"/>
                DataPro
            </NavbarBrand>

            <NavbarToggler onClick={toggleNavbar} className="mr-2" />
            <Collapse isOpen={!collapsed} navbar>
                <Nav navbar>
                    <NavItem>
                        <NavLink onClick={collapse} tag={ReactLink} exact to="/about" >About</NavLink>
                    </NavItem>

                    <NavItem>
                        <NavLink onClick={collapse} tag={ReactLink} exact to="/measurements" >Measurements</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink onClick={collapse} tag={ReactLink} exact to="/docs" >Documentation</NavLink>
                    </NavItem>

                    
                    <NavItem>
                        <NavLink onClick={collapse} tag={ReactLink} exact to="/login" >Login</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink onClick={collapse} tag={ReactLink} exact to="/register" >Register</NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
        </div>
    );
  
}
