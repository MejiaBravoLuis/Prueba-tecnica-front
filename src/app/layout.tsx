import Providers from "./providers";
import "./globals.css";

export default function RootLayout({ children }: any) {
  return (
    <html lang="es">
      <body className="bg-white dark:bg-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}