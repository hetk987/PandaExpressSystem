import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import { Separator } from "@radix-ui/react-separator"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
        <SidebarProvider >
            <AppSidebar />
            <main>
                {children}
            </main>
        </SidebarProvider>

        <footer className="fixed bottom-0 w-full bg-dark-red p-4 text-white z-50 flex flex-row justify-between">
            <a href="/">Quit</a>

            <div className="flex h-5 items-center space-x-4">
                <p>$67</p>
                <Separator orientation="vertical" className="bg-white"/>
                <a href="/">Checkout</a>
            </div>
        </footer>
    </div>

    
  )
}