
import React, { PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function PortalOverlay({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
