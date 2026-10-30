import './globals.css';

export const metadata = { title: 'Birthday check-in' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
