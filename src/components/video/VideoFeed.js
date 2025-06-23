import VideoPlayer from './VideoPlayer';
import VideoInteractions from './VideoInteractions';

export default function VideoFeed({ isRecipeOpen, setIsRecipeOpen, isCommentOpen, setIsCommentOpen, setIsProfileOpen}) {
  return (
    <div className="flex justify-center items-center w-full p-4 min-h-screen">
      {/* Container cho video và interaction */}
      <div className="relative flex items-center">
        {/* Video Player */}
        <div className={`flex-shrink-0 max-h-screen overflow-hidden rounded-lg ${isRecipeOpen || isCommentOpen ? 'max-w-[600px]' : 'max-w-[800px]'}`}>
          <VideoPlayer
            isRecipeOpen={isRecipeOpen}
            isCommentOpen={isCommentOpen}
          />
        </div>

        {/* Video Interactions - dính vào cạnh phải video */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col justify-center items-center text-white">
          <VideoInteractions 
          onRecipeClick={() => {
            setIsRecipeOpen(!isRecipeOpen);
            if (!isRecipeOpen) {
              setIsCommentOpen(false);
            }
          }}
          onCommentClick={() => {
            setIsCommentOpen(!isCommentOpen)
            if (!isCommentOpen) {
              setIsRecipeOpen(false)
            }
          }}
          />
        </div>
      </div>
    </div>
  );
}
