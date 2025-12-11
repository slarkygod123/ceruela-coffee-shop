"use client";
import { useAuth } from "@/lib/store/useAuth";
import Link from "next/link";
import { UserCircle, LogOut, Heart, Package } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/useMounted";

export default function NavbarLinks() {
  const { isLoggedIn, email, logout } = useAuth();

  const mounted = useMounted();
  if (!mounted) return null;

  return (
    <div className="flex items-center space-x-6">
      <Link
        href="/shop"
        className="flex items-center text-md font-medium text-gray-700 hover:text-gray-900 hover:underline"
      >
        Shop Now
      </Link>

      {isLoggedIn ? (
        <div className="flex items-center gap-4">
          {/* Visible account button - ADD modal={false} HERE */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full h-10 px-4 border border-gray-300 hover:bg-gray-100 flex items-center gap-2"
              >
                <UserCircle className="h-5 w-5 text-gray-700" />
                <span className="text-sm font-medium text-gray-700 hidden md:inline">
                  My Account
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 p-2 shadow-xl border border-gray-200 rounded-lg bg-white"
              // You can also try adding sideOffset to prevent overlap
              sideOffset={5}
            >
              <DropdownMenuLabel className="p-3 bg-gray-50 rounded-md">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none text-gray-900">
                    My Account
                  </p>
                  <p className="text-xs leading-none text-gray-500 truncate">
                    {email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-2" />

              <DropdownMenuItem
                asChild
                className="rounded-md px-3 py-2.5 cursor-pointer hover:bg-gray-100"
              >
                <Link
                  href="/profile"
                  className="w-full flex items-center gap-3"
                >
                  <UserCircle className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Profile
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="rounded-md px-3 py-2.5 cursor-pointer hover:bg-gray-100"
              >
                <Link
                  href="/favorites"
                  className="w-full flex items-center gap-3"
                >
                  <Heart className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Favorites
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="rounded-md px-3 py-2.5 cursor-pointer hover:bg-gray-100"
              >
                <Link href="/orders" className="w-full flex items-center gap-3">
                  <Package className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Order History
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2" />

              <DropdownMenuItem
                onClick={logout}
                className="rounded-md px-3 py-2.5 cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-md font-medium text-gray-700 hover:text-gray-900 hover:underline"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-md font-medium text-gray-700 hover:text-gray-900 hover:underline"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
