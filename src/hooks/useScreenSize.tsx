import { useState, useEffect } from 'react';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'desktop' | 'tablet'>(
    'desktop'
  );

  useEffect(() => {
    const getScreenSize = () => {
      const width = window.innerWidth;

      if (width < 768) {
        return 'mobile';
      } else if (width < 1024) {
        return 'tablet';
      } else {
        return 'desktop';
      }
    };

    const handleResize = () => {
      setScreenSize(getScreenSize());
    };

    setScreenSize(getScreenSize());
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

export default useScreenSize;
