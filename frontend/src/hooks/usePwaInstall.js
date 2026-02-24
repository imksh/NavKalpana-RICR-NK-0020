import { useCallback, useEffect, useState } from "react";
import {
  getPwaInstallState,
  initPwaInstall,
  promptPwaInstall,
  subscribePwaInstall,
} from "../utils/pwaInstall";

const usePwaInstall = () => {
  const [state, setState] = useState(() => getPwaInstallState());

  useEffect(() => {
    initPwaInstall();
    return subscribePwaInstall(setState);
  }, []);

  const promptInstall = useCallback(() => promptPwaInstall(), []);

  return {
    canInstall: Boolean(state.deferredPrompt) && !state.isInstalled,
    isInstalled: state.isInstalled,
    promptInstall,
  };
};

export default usePwaInstall;
