"use client";
import { Dialog, DialogContent, DialogHeader,DialogTitle,} from "@/components/ui/dialog";
import {FaFacebookSquare, FaLink, FaTelegramPlane,
} from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import toast from 'react-hot-toast';

export default function ShareModal({ open, onOpenChange, shareUrl }) {

  console.log("a", shareUrl);
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-white sm:max-w-[400px] bg-gray-900 rounded-lg p-6">
        <DialogHeader>
          <DialogTitle>Share this video</DialogTitle>
        </DialogHeader>

        <div className="mt-6 flex justify-center space-x-6">
          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 transition"
            aria-label="Share on Facebook"
          >
            <FaFacebookSquare className="text-white text-2xl" />
          </a>

          {/* X (Twitter) */}
          <a
            href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition"
            aria-label="Share on X"
          >
            <FaSquareXTwitter className="text-white text-2xl" />
          </a>

          {/* Telegram */}
          <a
            href={`https://t.me/share/url?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-full bg-[#0088cc] flex items-center justify-center hover:bg-[#34abe0] transition"
            aria-label="Share on Telegram"
          >
            <FaTelegramPlane className="text-white text-2xl" />
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition"
            aria-label="Copy link"
          >
            <FaLink className="text-white text-2xl" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
