"use client"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import UserAvatar from "./UserAvatar";
import Image from "next/image";
import logo from "public/logos/logo-sekelton.svg"
import Link from "next/link";

export default function NavBar() {

    return (
      <>
        <div className="infline-flex font-display mx-10 flex w-full max-w-screen-2xl items-center justify-between">
          <Link href={"/"} className="inline-flex items-center pr-4 rounded-lg">
            <div className="relative m-2 aspect-square h-10 w-auto">
              <Image
                alt="Logo dark"
                src={logo}
                fill
                className="rounded-lg "
                priority={true}
              />

            </div>
            <span className="ml-4 bg-gradient-to-r from-[#8F5E25] via-[#FBF4A1] to-[#8F5E25] bg-clip-text text-2xl font-bold text-transparent">
              Maximilian Kemkes
            </span>
          </Link>
          <div className="inline-flex justify-between">
            <NavigationMenu>
              <NavigationMenuList className="marker-none gap-10">
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Item One</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Link</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Item Two</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <NavigationMenuLink>Link</NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <UserAvatar className={"m-2 ml-10 h-10 shadow-lg"}></UserAvatar>
          </div>
        </div>
      </>
    );
}
