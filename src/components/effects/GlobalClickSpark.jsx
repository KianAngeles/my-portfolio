import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ClickSpark } from "@appletosolutions/reactbits";

const SPARK_BLOCK_SELECTOR =
  "input, textarea, select, [contenteditable], [contenteditable='true'], [contenteditable='plaintext-only']";
const DRAG_THRESHOLD_PX = 8;

function getStoredTheme() {
  try {
    return window.localStorage.getItem("theme");
  } catch {
    return null;
  }
}

function getExplicitThemeMode() {
  const root = document.documentElement;
  const body = document.body;

  const explicitThemeValues = [
    root.dataset?.theme,
    root.getAttribute("data-theme"),
    body?.dataset?.theme,
    body?.getAttribute("data-theme"),
    getStoredTheme(),
  ];

  for (const value of explicitThemeValues) {
    if (!value) continue;
    const normalized = String(value).toLowerCase();
    if (normalized.includes("dark")) return "dark";
    if (normalized.includes("light")) return "light";
  }

  if (root.classList.contains("dark") || body?.classList.contains("dark")) {
    return "dark";
  }

  if (root.classList.contains("light") || body?.classList.contains("light")) {
    return "light";
  }

  return null;
}

function getModeFromEnvironment() {
  const explicitMode = getExplicitThemeMode();
  if (explicitMode) return explicitMode;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function useThemeMode() {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "light";
    return getModeFromEnvironment();
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const syncMode = () => {
      const next = getModeFromEnvironment();
      setMode((prev) => (prev === next ? prev : next));
    };

    syncMode();

    const rootObserver = new MutationObserver(syncMode);
    rootObserver.observe(root, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    let bodyObserver = null;
    if (body) {
      bodyObserver = new MutationObserver(syncMode);
      bodyObserver.observe(body, {
        attributes: true,
        attributeFilter: ["class", "data-theme"],
      });
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => syncMode();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    return () => {
      rootObserver.disconnect();
      bodyObserver?.disconnect();

      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
    };
  }, []);

  return mode;
}

export default function GlobalClickSpark({ children }) {
  const mode = useThemeMode();
  const dragStartedRef = useRef(false);
  const pointerStartRef = useRef({ active: false, x: 0, y: 0 });

  const sparkColor = useMemo(
    () => (mode === "dark" ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.88)"),
    [mode]
  );

  const beginPointer = useCallback((clientX, clientY) => {
    pointerStartRef.current = { active: true, x: clientX, y: clientY };
    dragStartedRef.current = false;
  }, []);

  const updatePointer = useCallback((clientX, clientY) => {
    const start = pointerStartRef.current;
    if (!start.active) return;

    if (
      Math.abs(clientX - start.x) > DRAG_THRESHOLD_PX ||
      Math.abs(clientY - start.y) > DRAG_THRESHOLD_PX
    ) {
      dragStartedRef.current = true;
    }
  }, []);

  const endPointer = useCallback(() => {
    pointerStartRef.current.active = false;
  }, []);

  const handleMouseDownCapture = useCallback(
    (event) => {
      if (event.button !== 0) return;
      beginPointer(event.clientX, event.clientY);
    },
    [beginPointer]
  );

  const handleMouseMoveCapture = useCallback(
    (event) => {
      if (event.buttons !== 1) return;
      updatePointer(event.clientX, event.clientY);
    },
    [updatePointer]
  );

  const handleTouchStartCapture = useCallback(
    (event) => {
      const touch = event.touches?.[0];
      if (!touch) return;
      beginPointer(touch.clientX, touch.clientY);
    },
    [beginPointer]
  );

  const handleTouchMoveCapture = useCallback(
    (event) => {
      const touch = event.touches?.[0];
      if (!touch) return;
      updatePointer(touch.clientX, touch.clientY);
    },
    [updatePointer]
  );

  const handleClickFilter = useCallback((event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (dragStartedRef.current) {
      dragStartedRef.current = false;
      event.stopPropagation();
      return;
    }

    if (target.closest(SPARK_BLOCK_SELECTOR)) {
      event.stopPropagation();
    }
  }, []);

  return (
    <ClickSpark sparkColor={sparkColor} sparkCount={14} sparkRadius={30}>
      <div
        onClick={handleClickFilter}
        onMouseDownCapture={handleMouseDownCapture}
        onMouseMoveCapture={handleMouseMoveCapture}
        onMouseUpCapture={endPointer}
        onTouchStartCapture={handleTouchStartCapture}
        onTouchMoveCapture={handleTouchMoveCapture}
        onTouchEndCapture={endPointer}
      >
        {children}
      </div>
    </ClickSpark>
  );
}
