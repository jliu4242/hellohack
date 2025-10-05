'use client';

import { useEffect, useRef } from 'react';
import { auth } from '../../firebase/firebase.js';
import { uiConfig } from '../../firebase/firebaseui.js';

export default function FirebaseAuthUI() {
  const containerRef = useRef(null);

  useEffect(() => {
    // run only in browser
    (async () => {
      const firebaseui = await import('firebaseui');
      const existing = firebaseui.auth.AuthUI.getInstance();
      const ui = existing || new firebaseui.auth.AuthUI(auth);
      ui.start(containerRef.current, uiConfig);
    })();

    // cleanup on unmount (avoid duplicates in dev)
    return () => {
      const firebaseui = require('firebaseui');
      const ui = firebaseui.auth.AuthUI.getInstance();
      if (ui) ui.reset();
    };
  }, []);

  return <div ref={containerRef}></div>;
}