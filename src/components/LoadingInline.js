import { useEffect } from 'react';

const InlineLoading = () => {
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
    <div className="flex items-center">
      <div style={{ width: 48, height: 48 }}>
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

export default InlineLoading;
