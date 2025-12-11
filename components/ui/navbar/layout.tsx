import React from "react";
import NavbarContainer from "./navbar-container";

export default function NavbarLayout({ children }: { children: React.ReactNode }) {
    return (
        <React.Fragment>
        <NavbarContainer/>
        {children}
        </React.Fragment>
    );
}