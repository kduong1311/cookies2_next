'use client';
import CustomVideo from "./CustomVideo";
import { ShoppingBag } from "lucide-react";
import Link from 'next/link';

export default function VideoPlayer({ isRecipeOpen, isCommentOpen}) {
  return (
    <div className={`w-auto max-h-[97vh] relative ${isRecipeOpen || isCommentOpen ? 'max-w-[600px]' : 'max-w-[1000px]'}`}>
      <CustomVideo src="/pho.mp4" />

      {/* Avatar and text */}
      <div
        className="absolute bottom-5 left-4 text-white flex items-center"
      >
      <Link href={"/profile/1SIrfb41r4hVj0YqRlWeqoW5Idw1"}>
        <img
          src={'/Logo.png'}
          alt="avatar"
          className="w-10 h-10 rounded-full mr-3 border border-[#f18921]"
        />
      </Link>
        
        <div>
          <p className="font-semibold">{'Tran Khanh Duong'}</p>
          <p className="text-sm text-gray-200">{'Day la video dau tien cua toi'}</p>
        </div>
      </div>

      {/* Shop button */}
      <button className="absolute bottom-5 right-5 bg-orange text-white p-3 rounded-full shadow-lg">
        <ShoppingBag size={30} />
      </button>
    </div>
  );
}