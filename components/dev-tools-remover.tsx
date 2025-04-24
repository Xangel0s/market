'use client';

import { useEffect } from 'react';

export function DevToolsRemover() {
  useEffect(() => {
    const hideDevTools = () => {
      // Crear una hoja de estilo para ocultar elementos de Next.js
      if (!document.getElementById('dev-tools-remover-style')) {
        const style = document.createElement('style');
        style.id = 'dev-tools-remover-style';
        style.textContent = `
          [data-nextjs-dialog],
          .nextjs-build-watcher,
          .__next-build-watcher,
          button#__nextjs,
          .nextjs-toast,
          #__NEXT_DEV_TOOLTIP__,
          div[aria-live="assertive"],
          [class*="n-circle"],
          [class*="n-badge"],
          [class*="next-build"],
          [data-testid="n-badge"],
          [data-next-hide="true"],
          [data-next-config-button="true"],
          button[aria-label*="Next.js"],
          button[aria-label*="nextjs"],
          a[aria-label*="Next.js"],
          a[aria-label*="nextjs"],
          [style*="position: fixed"][style*="bottom: 0"][style*="left: 0"],
          button[style*="position: fixed"][style*="z-index: 2147483647"],
          [style*="border-radius: 50%"][style*="width: 40px"][style*="height: 40px"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
            position: absolute !important;
            width: 0 !important;
            height: 0 !important;
            overflow: hidden !important;
            clip: rect(0, 0, 0, 0) !important;
            -webkit-clip-path: inset(50%) !important;
            clip-path: inset(50%) !important;
            z-index: -9999 !important;
          }
          
          /* Ocultar elementos colocados en el fondo de la página */
          body > div:last-child:not([class]):not([id]) {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      }
      
      // Remover elementos dinámicamente
      const selectors = [
        '[data-nextjs-dialog]',
        '.nextjs-build-watcher',
        '.__next-build-watcher',
        'button#__nextjs',
        '.nextjs-toast',
        '#__NEXT_DEV_TOOLTIP__',
        'div[aria-live="assertive"]',
        'body > div:last-child:not(:first-child)',
        // Posible botón N
        'div[style*="position: fixed"][style*="bottom"]',
        'div[style*="position:fixed"][style*="bottom"]',
        'button[style*="position: fixed"]',
        'button[style*="z-index: 2147483647"]',
        // Otros elementos de Next.js
        '[data-testid="n-badge"]',
        '.n-wrapper',
        '.n-circle'
      ];
      
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.display = 'none';
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
            el.style.zIndex = '-9999';
            
            try {
              el.remove(); // Intentar eliminar del DOM
            } catch (e) {
              // Ignorar errores de eliminación
            }
          }
        });
      });
      
      // Buscar elementos que contienen texto específico o patrones específicos
      const allElements = document.querySelectorAll('*');
      for (const el of allElements) {
        if (el instanceof HTMLElement) {
          const innerHTML = el.innerHTML?.toLowerCase() || '';
          const outerHTML = el.outerHTML?.toLowerCase() || '';
          const style = window.getComputedStyle(el);
          
          if (
            (
              // Elementos con posición fija
              style.position === 'fixed' && 
              (style.bottom === '0px' || parseInt(style.bottom) < 20) &&
              (
                (innerHTML.includes('n') && el.childElementCount <= 1) ||
                outerHTML.includes('nextjs') ||
                outerHTML.includes('vercel')
              )
            ) || (
              // Círculos flotantes
              style.position === 'fixed' && 
              style.borderRadius === '50%' && 
              parseInt(style.width) <= 50 && 
              parseInt(style.height) <= 50
            )
          ) {
            el.style.display = 'none';
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            
            // Si es un elemento pequeño y flotante, intentar removerlo
            if (parseInt(style.width) <= 50 && parseInt(style.height) <= 50) {
              try {
                el.remove();
              } catch (e) {
                // Ignorar errores
              }
            }
          }
        }
      }
    };
    
    // Ejecutar inmediatamente
    hideDevTools();
    
    // Programar comprobaciones periódicas
    const interval = setInterval(hideDevTools, 500);
    
    // También ejecutar cuando se carga completamente la página o cambia la ruta
    window.addEventListener('load', hideDevTools);
    window.addEventListener('popstate', hideDevTools);
    
    // Crear un MutationObserver para detectar cambios en el DOM
    const observer = new MutationObserver(() => {
      hideDevTools();
    });
    
    // Observar todo el documento para cambios
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Limpieza
    return () => {
      clearInterval(interval);
      window.removeEventListener('load', hideDevTools);
      window.removeEventListener('popstate', hideDevTools);
      observer.disconnect();
    };
  }, []);
  
  return null;
} 