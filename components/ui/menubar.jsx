import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"

function cn(...classes){return classes.filter(Boolean).join(" ")}

const Menubar = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-white p-1 text-sm text-gray-700 shadow-sm",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarMenu = MenubarPrimitive.Menu

const MenubarTrigger = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex cursor-default select-none items-center rounded-sm px-3 py-1.5 font-medium outline-none",
      "hover:bg-gray-50 focus:bg-gray-50",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarContent = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Content
    ref={ref}
    className={cn(
      "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-white p-1 text-sm shadow-md",
      className
    )}
    {...props}
  />
))
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef(({ className, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 outline-none",
      "hover:bg-gray-50 focus:bg-gray-50",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

export { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem }
