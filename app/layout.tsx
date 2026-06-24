import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eucaliptoimobiliaria.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Eucalipto Imobiliária – Terrenos premium para investidores",
  description:
    "Eucalipto Imobiliária - Curadoria de terrenos acima de 650 m² e R$ 2 milhões para grandes investidores. Oportunidades selecionadas com foco em valorização e segurança patrimonial.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Eucalipto Imobiliária",
    title: "Eucalipto Imobiliária – Terrenos premium para investidores",
    description:
      "Curadoria de terrenos acima de 650 m² e R$ 2 milhões para grandes investidores, com foco em valorização e segurança patrimonial.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
