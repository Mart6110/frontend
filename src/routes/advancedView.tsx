import { createFileRoute } from "@tanstack/react-router"
import { requireApiKey } from "@/utils/requireApiKey"
import { AdvancedViewPage } from "@/pages/advancedView"

export const Route = createFileRoute("/advancedView")({
  beforeLoad: requireApiKey,
  component: AdvancedViewPage,
})
