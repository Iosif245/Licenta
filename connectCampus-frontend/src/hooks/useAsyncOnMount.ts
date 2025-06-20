import { useEffect, useState } from 'react';

const useAsyncOnMount = (asyncFunc: () => Promise<void>): boolean => {
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        await asyncFunc();
      } catch (err) {
        // swallow exception
      } finally {
        setIsReady(true);
      }
    })();
  }, [asyncFunc]);
  return isReady;
};

export default useAsyncOnMount;
