import { createRoot } from 'react-dom/client';

const root = document.getElementById('root')!;
const host = window.location.hostname;
const isPreviewHost =
  host.includes('id-preview--') ||
  host.includes('preview--') ||
  host.endsWith('.lovableproject.com');

// The native App Skeleton is now pre-rendered directly in index.html

// Unregister service workers in preview/iframe to prevent stale cache issues
const isInIframe = (() => {
  try { return window.self !== window.top; } catch { return true; }
})();

if (isPreviewHost || isInIframe) {
  navigator.serviceWorker?.getRegistrations().then((regs) => {
    regs.forEach((r) => r.unregister());
  });
}

// Clear app caches in background — never blocks startup, never touches auth
const clearAppCaches = () => {
  try {
    if ('caches' in window) {
      caches.keys().then(keys =>
        Promise.all((isPreviewHost ? keys : keys.filter(k => k.startsWith('welile-'))).map(k => caches.delete(k)))
      ).catch(() => {});
    }
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_API_CACHE' });
    }
  } catch {}
};

// Preview-only watchdog: if app mounts into an invisible/empty state, show recovery UI
const hasVisibleAppContent = () => {
  try {
    const elements = Array.from(root.querySelectorAll('*')) as HTMLElement[];
    return elements.some((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return false;
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
  } catch {
    return false;
  }
};

const schedulePreviewBlankPageGuard = () => {
  if (!isPreviewHost) return;

  const check = () => {
    requestAnimationFrame(() => {
      if (!hasVisibleAppContent()) {
        console.error('[Main] Preview blank-page guard triggered');
        showErrorUI();
      }
    });
  };

  setTimeout(check, 7000);
  setTimeout(check, 14000);
};

// Mount app immediately — cache clearing runs in background
const loadApp = async () => {
  // In preview, clear immediately for self-healing; elsewhere do it idle
  if (isPreviewHost) {
    clearAppCaches();
  } else if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(clearAppCaches);
  } else {
    setTimeout(clearAppCaches, 2000);
  }
  try {
    // Hard timeout: if imports hang >12s, reject so we show error UI
    const importTimeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Import timeout')), 30000)
    );
    // Critical CSS loaded eagerly, rest deferred
    const importApp = Promise.all([
      import("./critical.css"),
      import("./App.tsx"),
    ]);

    // Preload full CSS in background (non-blocking)
    import("./index.css");

    const [, { default: App }] = await Promise.race([importApp, importTimeout]) as [any, { default: any }];

    createRoot(root).render(<App />);

    // Preload Dashboard chunk for authenticated users
    try {
      const cached = localStorage.getItem('welile_session_cache');
      if (cached) {
        import('./pages/Dashboard');
      }
    } catch {}
    schedulePreviewBlankPageGuard();
  } catch (err) {
    console.error('[Main] App load failed:', err);
    showErrorUI();
  }
};

function showErrorUI() {
  root.textContent = '';
  const container = document.createElement('div');
  container.style.cssText = 'min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f8fafc;gap:16px;padding:24px;text-align:center';

  const logo = document.createElement('img');
  logo.src = '/welile-logo.png';
  logo.alt = 'Welile';
  logo.width = 48;
  logo.height = 48;
  logo.style.borderRadius = '12px';

  const heading = document.createElement('h2');
  heading.textContent = 'Connection Error';
  heading.style.cssText = 'font-size:18px;font-weight:600;color:#1f2937;margin:0';

  const msg = document.createElement('p');
  msg.textContent = 'Check your internet connection and try again.';
  msg.style.cssText = 'font-size:14px;color:#6b7280;margin:0;max-width:280px';

  const btn = document.createElement('button');
  btn.textContent = 'Tap to Retry';
  btn.onclick = () => location.reload();
  btn.style.cssText = 'padding:12px 24px;background:#7c3aed;color:white;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;min-height:44px';

  container.append(logo, heading, msg, btn);
  root.appendChild(container);
}

loadApp();

// Show retry UI after 8s on slow networks
setTimeout(() => {
  if (root.querySelector('.app-shell-skeleton')) { // checks if skeleton is still in DOM meaning React hasn't mounted
    const retryBtn = document.createElement('button');
    retryBtn.textContent = 'Tap to Retry';
    retryBtn.onclick = () => location.reload();
    retryBtn.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);padding:12px 24px;background:#7c3aed;color:white;border:none;border-radius:8px;font-size:14px;font-weight:500;cursor:pointer;min-height:44px;z-index:9999;box-shadow:0 10px 15px -3px rgba(124,58,237,0.3)';
    root.appendChild(retryBtn);
  }
}, 8000);

// Suppress chunk/import errors — user can pull-to-refresh manually
addEventListener('vite:preloadError', (e) => e.preventDefault());
addEventListener('unhandledrejection', (e) => {
  const r = String((e as any).reason ?? '').toLowerCase();
  if (r.includes('dynamically imported') || r.includes('failed to fetch') || r.includes('loading chunk') || r.includes('import timeout') || r.includes('module script failed')) {
    e.preventDefault();
    if (!sessionStorage.getItem('chunk_retry')) {
      sessionStorage.setItem('chunk_retry', '1');
      window.location.reload();
    }
  }
});

// Service worker strategy:
// - Preview: disable + unregister to avoid white screens from stale SW cache
// - Live: register for offline support

if ('serviceWorker' in navigator) {
  if (isPreviewHost) {
    // Silently unregister SWs but NEVER force-reload — prevents blank page loops
    navigator.serviceWorker.getRegistrations()
      .then(regs => Promise.all(regs.map(r => r.unregister())))
      .catch(() => {});
  } else {
    const register = () => navigator.serviceWorker.register('/sw.js').catch(() => {});
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(register);
    } else {
      setTimeout(register, 1000);
    }
  }
}