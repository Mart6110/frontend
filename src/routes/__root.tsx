import { Provider } from "@/components/ui/provider";
import { createRootRoute, ErrorComponent } from "@tanstack/react-router";
import App from "@/App";
import { ErrorPage } from "@/pages/errorPage";

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: () => <ErrorPage statusCode={404} />,
    errorComponent: ({ error }) => <ErrorPage error={error} statusCode={500} />,
})

function RootComponent() {
    return (
        <Provider>
            <App />
        </Provider>
    )
}