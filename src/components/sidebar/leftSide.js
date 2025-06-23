"use client";
import { Home, Compass, Bell, User, Flame, HeartPlus, ShoppingBag, BellRing, Info, Upload, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import LoginModal from '@/components/user/LoginModal';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useConfirm } from '@/contexts/ConfirmContext';
import { Description } from '@radix-ui/react-dialog';

export default function LeftSidebar({ openShop,  goToVideoFeed }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Featured");
  const router = useRouter();
  const {logout, user} = useAuth();
  const confirm = useConfirm();

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
      setIsLoginModalOpen(true);
    }
  }; 

  const navItems = [
    { label: "Featured", icon: <Flame className="mr-3" />, 
      onClick: () => {
        router.push("/");
      },  
    },
    { label: "Explore", icon: <Compass className="mr-3" /> },
    { label: "Followed", icon: <HeartPlus className="mr-3" /> },
    { label: "Shop", icon: <ShoppingBag className="mr-3" />,
      onClick: () => {
        router.push("/shop");
      },
    },
    { label: "Notifications", icon: <BellRing className="mr-3" /> },
    { label: "Upload", icon: <Upload className="mr-3" />, 
        onClick: () => {
          router.push("/upload");
      },
    },
    { label: "About me", icon: <Info className="mr-3" />
    }, 
  ];

  return (
    <div className="w-64 border-r border-gray-800 p-4 flex flex-col">
      <div className="p-4 mb-8 rounded-lg items-center bg-orange">
        <img src='/Logo2-white.png' alt='logo' />
        <div className="w-full flex justify-center mt-3">
          {user ? (
          <Button
            onClick={handleLogout}
            variant="secondary"
            className="bg-white text-[#f18921] hover:bg-gray-100 rounded-2xl px-6"
          >
            <LogIn className="mr-4 h-2 w-4" />
            Logout
          </Button>
          ) : (
          <>
            <Button
              onClick={() => setIsLoginModalOpen(true)}
              variant="secondary"
              className="bg-white text-[#f18921] hover:bg-gray-100 rounded-2xl px-6"
            >
              <LogIn className="mr-4 h-2 w-4"/>
              Login
            </Button>
            <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
          </>
        )}
        </div>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-4">
          {navItems.map(({ label, icon, onClick }) => (
            <li
              key={label}
              onClick={() => handleClick(label, onClick)}
              className={`flex items-center p-3 rounded-lg cursor-pointer 
                ${activeItem === label
                  ? 'bg-orange text-white'
                  : 'hover-orange-bg text-white/80 hover:text-white'}`}
            >
              {icon}
              <span className="font-medium">{label}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto">
        <div className="text-xs text-gray-400 mt-4">
          <p className="mb-2">© 2025 Cookies</p>
        </div>
      </div>
    </div>
  );
}
