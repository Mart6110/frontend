import { RouterProvider, createRouter } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./store";
import { routeTree } from "./routeTree.gen"
import { setLocale } from "yup"

// Set Yup locale to Danish
setLocale({
  mixed: {
    required: "Dette felt er påkrævet",
    notType: "Ugyldig værdi",
  },
  string: {
    min: "Skal være mindst ${min} tegn",
    max: "Må højst være ${max} tegn",
    email: "Skal være en gyldig e-mail",
  },
  number: {
    min: "Skal være mindst ${min}",
    max: "Må højst være ${max}",
  },
})

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode>
);