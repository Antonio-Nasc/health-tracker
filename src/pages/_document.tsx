/**
 * Pages Router: documento raiz para metadados e idioma base da aplicação.
 */
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head />
      <body className="antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
