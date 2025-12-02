"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/app/components/ui/sidebar"
import { 
  Home, 
  Utensils, 
  Cookie, 
  Coffee, 
  ChefHat,
  Accessibility
} from "lucide-react"
import { usePathname } from "next/navigation"
import { AccessibilitySheet } from "./app-accessibility-sheet"
import { useAccessibilityStyles } from "@/hooks/use-accessibility-styles"

interface AppSidebarProps {
  temperature?: number;
  precipitation?: number;
  windSpeed?: number;
  windDirection?: number;
}

export function AppSidebar({ 
  temperature, 
  precipitation, 
  windSpeed, 
  windDirection 
}: AppSidebarProps) {
  const pathname = usePathname()
  const { textClasses } = useAccessibilityStyles()
  const menuItems = [
    {
      title: "Build Your Own",
      icon: ChefHat,
      href: "/home/build",
    },
    {
      title: "Entrees",
      icon: Utensils,
      href: "/home/entree",
    },
    {
      title: "Sides",
      icon: Cookie,
      href: "/home/side",
    },
    {
      title: "Drinks",
      icon: Coffee,
      href: "/home/drink",
    },
    {
      title: "Appetizers",
      icon: Cookie,
      href: "/home/appetizer",
    },
    {
      title: "Manager View",
      icon: ChefHat, 
      href: "/employee/manager" 
    }
  ]

  return (
    <Sidebar collapsible="icon">
        <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem className="text-white">
            <SidebarMenuButton size="lg" asChild isActive={pathname === "/home"}>
              <a href="/home" className={`font-bold text-lg ${textClasses}`}>
                <Home className="size-5" />
                <span>Panda Express</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-10">
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`text-white hover:text-black border rounded-md ${textClasses}`}
                    isActive={pathname.startsWith(item.href)}
                    size="lg"
                  >
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <AccessibilitySheet
                temperature={temperature}
                precipitation={precipitation}
                windSpeed={windSpeed}
                windDirection={windDirection}
                trigger={
                  <SidebarMenuButton size="lg" className={`text-white hover:text-black border rounded-md w-full ${textClasses}`}>
                    <Accessibility className="size-5" />
                    <span>Accessibility</span>
                  </SidebarMenuButton>
                }
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border min-h-15 items-center justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="sm">
              <a href="/home" className="text-muted-foreground hover:text-foreground">
                <span className={`text-xs text-white ${textClasses}`}>© 2024 Panda Express</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}