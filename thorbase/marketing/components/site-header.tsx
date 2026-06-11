import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuLinkVariants
} from "@/components/ui/navigation-menu";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getAppUrl } from "@/lib/app-url";

const appUrl = getAppUrl("/sign-in");
const navLinks = [
  { label: "Models", href: "/models" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-2 z-50 mt-2 mb-1 px-2 sm:top-3 sm:mb-3 sm:px-3">
      <div className="font-mono mx-auto flex w-[min(1200px,94vw)] items-center justify-between gap-2 rounded-md bg-[#FFFEF5] px-3 py-2.5 text-black sm:gap-4 sm:px-4 sm:py-3">
        <Link className="min-w-0 truncate font-semibold text-black no-underline" href="/">
          TokenGO
        </Link>
        <NavigationMenu aria-label="Primary" className="hidden md:flex">
          <NavigationMenuList className="gap-4">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.label}>
                <NavigationMenuLink
                  href={link.href}
                  className={`${navigationMenuLinkVariants()} inline-flex w-28 justify-start border-b border-black pb-1 !text-left !text-black hover:border-zinc-600 hover:bg-black/5 hover:!text-black`}
                >
                  {link.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <a
                href="https://dashboard.tokengo.com/sign-in"
                className="inline-flex items-center text-sm text-black/70 no-underline hover:text-black"
              >
                Login
              </a>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild>
                <a href={appUrl}>Get started</a>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Sheet>
          <SheetTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-1.5 text-black hover:bg-black/5 md:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent className="w-[86vw] max-w-[340px] bg-[#FFFEF5] p-0">
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <Link className="font-semibold text-black no-underline" href="/">
                TokenGO
              </Link>
              <SheetClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md p-1.5 text-black hover:bg-black/5"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </SheetClose>
            </div>
            <nav className="flex flex-col px-5 pt-4 pb-6">
              {navLinks.map((link) => (
                <SheetClose asChild key={link.label}>
                  <Link
                    className="inline-flex min-h-12 w-full items-center border-b border-black/10 py-3 text-[1rem] text-black no-underline hover:bg-black/5"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <a
                  href="https://dashboard.tokengo.com/sign-in"
                  className="inline-flex min-h-12 w-full items-center border-b border-black/10 py-3 text-[1rem] text-black no-underline hover:bg-black/5"
                >
                  Login
                </a>
              </SheetClose>
              <Button asChild className="mt-5 h-11 w-full">
                <a href={appUrl}>Get started</a>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
