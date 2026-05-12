/**
 * Pages Router: entrada global da UI com providers de estado/cache.
 */
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { AppProviders } from "@/app/providers/AppProviders";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}
