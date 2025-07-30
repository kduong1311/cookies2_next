"use client";
import {Compass, BellRing, Flame, HeartPlus, ShoppingBag, Info, Upload, LogIn, LogOut, Search} from 'lucide-react';
import LoginModal from '@/components/user/LoginModal';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirm } from '@/contexts/ConfirmContext';
import "@/app/css/loginButton.css";

export default function LeftSidebar({ openShop, goToVideoFeed }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { logout, user } = useAuth();
  const confirm = useConfirm();
  const router = useRouter();
  const pathname = usePathname();

  const getNavItemFromPath = (path) => {
    if (path?.includes("search")) return "Search";
    if (path?.includes("shop")) return "Shop";
    if (path?.includes("upload")) return "Upload";
    if (path?.includes("about")) return "About";
    return "Featured";
  };

  const [activeItem, setActiveItem] = useState(() => getNavItemFromPath(pathname));

  useEffect(() => {
    setActiveItem(getNavItemFromPath(pathname));
  }, [pathname]);

  const handleClick = (item, callback) => {
    setActiveItem(item);
    if (callback) callback();
  };

  const handleLogout = async () => {
    const ok = await confirm({
      title: "Logout",
      description: "Are you sure you want to logout?"
    });
    if (ok) {
      await logout();
      router.push("/");
    }
  };

  const navItems = [
    { label: "Featured", icon: <Flame className="h-5 w-5" />, onClick: () => router.push("/") },
    { label: "Search", icon: <Search className="h-5 w-5" />, onClick: () => router.push("/search") },
    { label: "Shop", icon: <ShoppingBag className="h-5 w-5" />, onClick: () => router.push("/shop") },
    { label: "Upload", icon: <Upload className="h-5 w-5" />, onClick: () => router.push("/upload") },
    { label: "About Cookies", icon: <Info className="h-5 w-5" />, onClick: () => router.push("/about") },
  ];

  useEffect(() => {
    if (!user) {
      setIsLoginModalOpen(true);
    }
  }, [user]);

  return (
    <div className="w-64 border-r border-gray-800 p-4 flex flex-col">
      <div className="p-4 mb-8 rounded-lg items-center bg-orange">
        <img src='/Logo2-white.png' alt='logo' />
        <div className="w-full flex justify-center mt-3">
          {user ? (
            <div className="main_div">
              <button onClick={handleLogout}>
                <LogOut className="inline mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <div className="main_div">
                <button onClick={() => setIsLoginModalOpen(true)}>
                  <LogIn className="inline mr-2 h-4 w-4" />
                  Login
                </button>
              </div>
              <LoginModal
                open={isLoginModalOpen}
                onOpenChange={() => {
                  if (user) setIsLoginModalOpen(false);
                }}
              />
            </>
          )}
        </div>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-4">
          {navItems.map(({ label, icon, onClick }) => (
            <li key={label}>
              <button
                onClick={() => handleClick(label, onClick)}
                className={`navbar-button ${activeItem === label ? 'active bg-orange' : ''}`}
              >
                <div className="svg-wrapper">
                  {icon}
                </div>
                <span className="ml-3 font-medium">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="text-xs text-gray-400 mt-4">
        <p className="mb-2">© 2025 Cookies</p>
      </div>
    </div>
  );
}
