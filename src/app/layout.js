// app/layout.js
import "../app/globals.css"
import MainLayout from "./feed/MainLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ConfirmProvider } from "@/contexts/ConfirmContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "react-hot-toast";
import { icons } from "lucide-react";

export const metadata = {
  title: "Cookies",
  description: "Discover, Watch & Shop Delicious Recipes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ConfirmProvider>
        <CartProvider>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
            <Toaster position="top-center" reverseOrder={false} />
          </AuthProvider>
        </CartProvider>
      </ConfirmProvider>
      </body>
    </html>
  );
}
