import "./globals.css";

export const metadata = {
  title: "Roommate Protocol",
  description: "A compatibility instrument for people who have to share a kitchen.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}