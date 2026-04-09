import { createFileRoute } from "@tanstack/react-router"
import { requireApiKey } from "@/utils/requireApiKey"
import { SimpleViewPage } from "@/pages/simpleView"

export const Route = createFileRoute("/simpleView")({
  beforeLoad: requireApiKey,
  component: SimpleViewPage,
})
