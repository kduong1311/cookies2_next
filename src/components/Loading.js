import { useEffect } from 'react';

const Loading = () => {
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="dotlottie-player"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs';
      script.type = 'module';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-10">
      <div style={{ width: 300, height: 300 }}>
        <dotlottie-player
          src="https://lottie.host/9e6c6d6d-aacb-4dd7-91bc-01bbce33dcdc/zpybIeINtR.lottie"
          background="transparent"
          speed="1"
          style={{ width: '100%', height: '100%' }}
          loop
          autoPlay
        ></dotlottie-player>
      </div>
    </div>
  );
};

export default Loading;
