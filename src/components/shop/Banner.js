import React from "react";

export default function Banner({}) {
  return (
    <div
      className="relative mb-8 rounded-lg overflow-hidden h-48 md:h-64 flex items-center px-8"
      style={{
        backgroundImage: `url('https://cdn-media.sforum.vn/storage/app/media/black-friday.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
    </div>
  );
}
