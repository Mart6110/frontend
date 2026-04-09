import { Provider } from "@/components/ui/provider";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
    component: RootComponent,
})

function RootComponent() {
    return (
        <Provider>
            <Outlet />
        </Provider>
    )
}