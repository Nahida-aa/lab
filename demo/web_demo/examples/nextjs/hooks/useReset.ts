import { useState } from "react";

export function useReset() {
  const [_, forceUpdate] = useState({})

  return () => forceUpdate({})
}