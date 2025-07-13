import { type ReactNode, Suspense, useEffect, useState } from "react";

const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Suspense fallback={<div>Loading editor...</div>}>{children}</Suspense>
  );
};

export default ClientOnly;
