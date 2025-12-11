import { Coffee } from "lucide-react";
import Link from "next/link";

export default function NavbarLogo(){
    return (
        <Link href="/" className="text-md text-gray-700 font-medium"><Coffee className="h-8 w-8 text-amber-500 mr-4" /></Link>
    )
}