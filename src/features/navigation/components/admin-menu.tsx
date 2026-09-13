"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/shared/components/ui/navigation-menu";

import { cn } from "@/lib/utils";

import { ADMIN_MENU_ITEMS } from "../config/admin-menu.config";
import { isRouteActive } from "../config/active-menu.config";

export function AdminMenu() {
  const pathname = usePathname();

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex items-center gap-1">
        {ADMIN_MENU_ITEMS.map((item) => {
          const Icon = item.icon;

          /*
           * Normal menu item
           */
          if (!item.children) {
            if (!item.href) {
              return null;
            }

            const isActive = item.href
              ? isRouteActive(pathname, item.href)
              : false;

            return (
              <NavigationMenuItem key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2",
                    "rounded-md px-3 py-2",
                    "text-sm font-medium",
                    "transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </NavigationMenuItem>
            );
          }

          /*
           * Dropdown menu item
           */
          const isDropdownActive = item.children?.some((child) =>
            isRouteActive(pathname, child.href),
          );

          return (
            <NavigationMenuItem key={item.label}>
              <NavigationMenuTrigger
                className={cn(
                  "flex items-center gap-2",
                  "rounded-md px-3 py-2",
                  "text-sm font-medium",
                  "transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isDropdownActive && "bg-accent text-accent-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{item.label}</span>
              </NavigationMenuTrigger>

              <NavigationMenuContent>
                <div className="grid w-[320px] gap-1 p-2">
                  {item.children.map((child) => {
                    const ChildIcon = child.icon;

                    const isActive =
                      pathname === child.href ||
                      pathname.startsWith(`${child.href}/`);

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-start gap-3 rounded-md p-3",
                          "transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          isActive && "bg-accent text-accent-foreground",
                        )}
                      >
                        {ChildIcon && (
                          <ChildIcon className="mt-0.5 size-4 shrink-0" />
                        )}

                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">
                            {child.label}
                          </span>

                          {child.description && (
                            <span className="text-xs text-muted-foreground">
                              {child.description}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
