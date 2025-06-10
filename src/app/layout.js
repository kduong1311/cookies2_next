// app/layout.js
import "../app/globals.css"
import MainLayout from "./feed/MainLayout";

export const metadata = {
  title: "Foodie Platform",
  description: "Discover, Watch & Shop Delicious Recipes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
