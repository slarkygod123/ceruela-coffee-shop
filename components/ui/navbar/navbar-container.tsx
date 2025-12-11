import NavbarLinks from "./navbar-links";
import NavbarLogo from "./navbar-logo";


export default function NavbarContainer(){
    return (
        <div className="flex items-center justify-between p-4 px-10 bg-white border-b border-amber-200 shadow-sm">
            <NavbarLogo />
            <NavbarLinks />
        </div>
    );
}