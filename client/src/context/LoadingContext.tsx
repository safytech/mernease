import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

type LoadingContextType = {
  isLoading: boolean;
  startRequest: () => void;
  endRequest: () => void;
};

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startRequest: () => {},
  endRequest: () => {},
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const activeRequests = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeoutSafely = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const startRequest = useCallback(() => {
    activeRequests.current += 1;
    setIsLoading(true);
    clearTimeoutSafely();
  }, []);

  const endRequest = useCallback(() => {
    activeRequests.current -= 1;
    if (activeRequests.current <= 0) {
      activeRequests.current = 0;
      setIsLoading(false);
      clearTimeoutSafely();
    }
  }, []);

  useEffect(() => {
    if (isLoading && !timeoutRef.current) {
      timeoutRef.current = setTimeout(() => {
        console.warn("⚠️ Loader timeout reached — resetting loading state.");
        activeRequests.current = 0;
        setIsLoading(false);
      }, 20000);
    }
  }, [isLoading]);

  return (
    <LoadingContext.Provider value={{ isLoading, startRequest, endRequest }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
