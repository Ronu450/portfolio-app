// High-performance smooth section transition engine

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

let currentScrollAnimId: number | null = null;

/**
 * Fast, responsive, hardware-friendly smooth scroll to a given vertical pixel offset.
 * @param targetY Target scroll position in pixels
 * @param duration Duration in milliseconds (default 420ms for silky, responsive glide)
 */
export function smoothScrollTo(targetY: number, duration = 420): Promise<void> {
  return new Promise((resolve) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: targetY, behavior: "auto" });
      resolve();
      return;
    }

    if (currentScrollAnimId) {
      cancelAnimationFrame(currentScrollAnimId);
      currentScrollAnimId = null;
    }

    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;

    if (Math.abs(distance) < 2) {
      resolve();
      return;
    }

    let startTime: number | null = null;

    const cancelOnInterrupt = () => {
      window.removeEventListener("wheel", cancelOnInterrupt);
      window.removeEventListener("touchstart", cancelOnInterrupt);
      if (currentScrollAnimId) {
        cancelAnimationFrame(currentScrollAnimId);
        currentScrollAnimId = null;
      }
      resolve();
    };

    window.addEventListener("wheel", cancelOnInterrupt, { passive: true });
    window.addEventListener("touchstart", cancelOnInterrupt, { passive: true });

    function step(currentTime: number) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);

      window.scrollTo(0, startY + distance * eased);

      if (progress < 1) {
        currentScrollAnimId = requestAnimationFrame(step);
      } else {
        window.removeEventListener("wheel", cancelOnInterrupt);
        window.removeEventListener("touchstart", cancelOnInterrupt);
        currentScrollAnimId = null;
        resolve();
      }
    }

    currentScrollAnimId = requestAnimationFrame(step);
  });
}

/**
 * Fast, responsive scroll to section with navbar offset.
 * @param sectionId HTML id of target section
 * @param duration Duration in milliseconds (default 420ms)
 * @param offset Vertical offset to account for navbar (default -64px)
 */
export function smoothScrollToSection(
  sectionId: string,
  duration = 420,
  offset = -60
): Promise<void> {
  const element = document.getElementById(sectionId);
  if (!element) return Promise.resolve();

  const rect = element.getBoundingClientRect();
  const targetY = Math.max(0, rect.top + window.scrollY + offset);
  return smoothScrollTo(targetY, duration);
}

/**
 * Wheel dampening removed for native 60/120Hz high-refresh scroll responsiveness.
 */
export function initSlowWheelDamping(): () => void {
  return () => {};
}
