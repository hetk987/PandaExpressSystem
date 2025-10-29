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
            <h1>Panda Express</h1>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup>
                <p>Hey</p>
            </SidebarGroup>
            <SidebarGroup>
                <p>Hi</p>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
  )
}