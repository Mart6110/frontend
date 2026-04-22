import { createFileRoute } from "@tanstack/react-router"
import { ErrorPage } from "@/pages/errorPage"

export const Route = createFileRoute("/404")({
  component: NotFoundPage,
})

function NotFoundPage() {
  return <ErrorPage statusCode={404} />
}
