import React, { useState, useContext, useEffect } from 'react';
import { NavLink as ReactLink } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Button } from 'reactstrap';
import logo from '../logo.ico';

import { Context } from '../Context';


export default function AppNavbar() {

    const auth = useContext(Context);
    
    const [collapsed, setCollapsed] = useState(true);
    const [permission, setPermission] = useState('public');

    const toggleNavbar = () => setCollapsed(!collapsed);
    const collapse = () => setCollapsed(true);

    useEffect(() => {
        if (auth.logged)
            return setPermission(auth.user.permission);

        (async () => {
            if(await auth.isLogged())
                setPermission(auth.user.permission);
        })();
    }, []);

    return (
        <div>
        <Navbar className="navbar-expand-lg theme-navbar" dark>
            <NavbarBrand href={['public'].includes(permission) ? '/' : '/measurements'} className="mr-auto align-middle pr-3">
                <img className="d-inline-block align-top mx-3" src={logo} width="40px" alt="logo"/>
                DataPro
            </NavbarBrand>

            <NavbarToggler onClick={toggleNavbar} className="mr-2" />
            <Collapse isOpen={!collapsed} navbar>
                <Nav navbar>
                    { ['registered', 'user', 'admin'].includes(permission) &&
                        <NavItem>
                            <NavLink onClick={collapse} tag={ReactLink} exact to="/measurements" >Measurements</NavLink>
                        </NavItem>
                    }

                    { ['registered', 'user', 'admin'].includes(permission) &&
                        <NavItem>
                            <NavLink onClick={collapse} tag={ReactLink} exact to="/docs" >Documentation</NavLink>
                        </NavItem>
                    }

                    { ['public'].includes(permission) &&
                        <>
                            <NavItem>
                                <NavLink onClick={collapse} tag={ReactLink} exact to="/login" >Login</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={collapse} tag={ReactLink} exact to="/register" >Register</NavLink>
                            </NavItem>
                        </>
                    }
                    
                    <NavItem>
                        <NavLink onClick={collapse} tag={ReactLink} exact to="/about" >About</NavLink>
                    </NavItem>
                </Nav>

                { ['registered', 'user', 'admin'].includes(permission) &&
                    <Nav className="ml-auto" navbar>
                        <NavItem className="px-4 my-2">
                            <Button className="px-3" color="danger" onClick={()=>auth.unset()} >Logout</Button>
                        </NavItem>
                    </Nav>
                }


            </Collapse>
        </Navbar>
        </div>
    );
  
}
