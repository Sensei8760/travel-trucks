import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TravelTrucks',
  description: 'Camper rental service',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header додамо пізніше */}
        <main>{children}</main>
      </body>
    </html>
  );
}
