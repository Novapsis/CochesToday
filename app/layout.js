import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AuthProvider from "@/components/auth/AuthProvider";
import { Toaster } from "sonner";
import ThemeProvider from "@/components/theme-provider";
// import { ConciergeChat } from "@/components/concierge-chat";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CochesToday - Marketplace de Coches",
  description: "Compra y vende coches con nuestro servicio concierge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
      </head>
      <body className={`${inter.className}`}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main className="min-h-screen pt-36 pb-24">{children}</main>
            <Toaster richColors />
            <Footer />
          </AuthProvider>
        </ThemeProvider>
        {/* <ConciergeChat /> */}
      </body>
    </html>
  );
}
