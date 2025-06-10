import { useRef, useState } from "react";
import { Heart } from "lucide-react";
import { FaCommentDots, FaBook, FaShareAltSquare } from "react-icons/fa";
import gsap from "gsap";
import ShareModal from "../user/ShareModal";

export default function VideoInteractions({ onRecipeClick, onLike, onCommentClick}) {
  const heartRef = useRef(null);
  const [liked, setLiked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);  // State điều khiển mở modal

  const handleLike = () => {
    setLiked(!liked);
    onLike && onLike();

    gsap.fromTo(
      heartRef.current,
      { scale: 1 },
      {
        scale: 1.4,
        duration: 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut",
      }
    );
  };

  const openShareModal = () => {
    setShareOpen(true);
  };

  return (
    <>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-6">
        {/* Like button */}
        <button className="flex flex-col items-center" onClick={handleLike}>
          <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg">
            <Heart
              ref={heartRef}
              className={`w-7 h-7 ${
                liked ? "text-red-500 fill-red-500" : "text-white"
              }`}
            />
          </div>
        </button>

        {/* Comment button */}
        <button className="flex flex-col items-center" onClick={onCommentClick}>
          <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg">
            <FaCommentDots className="w-7 h-7 text-white" />
          </div>
        </button>

        {/* Recipe button */}
        <button className="flex flex-col items-center" onClick={onRecipeClick}>
          <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg">
            <FaBook className="w-6.5 h-6.5 text-white" />
          </div>
        </button>

        {/* Share button */}
        <button
          className="flex flex-col items-center"
          onClick={openShareModal}  // Mở modal khi click
        >
          <div className="w-12 h-12 rounded-full bg-orange flex items-center justify-center shadow-lg">
            <FaShareAltSquare className="w-7 h-7 text-white" />
          </div>
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal open={shareOpen} onOpenChange={setShareOpen} />
    </>
  );
}
