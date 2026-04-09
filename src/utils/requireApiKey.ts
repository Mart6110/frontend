import Cookies from "js-cookie"
import { redirect } from "@tanstack/react-router"

export function requireApiKey() {
  if (!Cookies.get("apiKey")) {
    throw redirect({ to: "/" })
  }
}
