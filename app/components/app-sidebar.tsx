import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
            <a href="/home">Panda Express</a>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <a href="/home/build">Build Your Own</a>
            </SidebarGroup>
            <SidebarGroup>
                <a href="/home/entree">Entrees</a>
            </SidebarGroup>
            <SidebarGroup>
                <a href="/home/side">Sides</a>
            </SidebarGroup>
            <SidebarGroup>
                <a href="/home/drink">Drinks</a>
            </SidebarGroup>
            <SidebarGroup>
                <a href="/home/appetizer">Appetizers</a>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
  )
}