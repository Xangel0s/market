'use client';

import { useEffect } from 'react';

export function LogoRemover() {
  useEffect(() => {
    // Función para eliminar el logo de Next.js
    const removeNextLogo = () => {
      // 1. Eliminar por atributos de estilo fijos en la esquina inferior
      const allElements = document.querySelectorAll('*');
      allElements.forEach(el => {
        if (el instanceof HTMLElement) {
          const style = window.getComputedStyle(el);
          // Buscar elementos fijos en las esquinas inferiores
          if (
            style.position === 'fixed' && 
            (style.bottom === '0px' || parseInt(style.bottom) < 20) &&
            (
              (style.right === '0px' || parseInt(style.right) < 20) ||
              (style.left === '0px' || parseInt(style.left) < 20)
            ) && 
            (
              el.innerText?.includes('N') || 
              el.innerHTML?.includes('nextjs') || 
              el.innerHTML?.includes('vercel') ||
              el.classList.toString().includes('n-') ||
              el.id?.includes('n-')
            )
          ) {
            el.style.display = 'none';
            el.style.opacity = '0';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
            el.style.width = '0';
            el.style.height = '0';
            el.remove(); // Intentar remover completamente
          }
        }
      });

      // 2. Eliminar por selectores específicos
      const selectors = [
        '[data-nextjs-dialog]',
        '.nextjs-build-watcher',
        '.__next-build-watcher',
        'button#__nextjs',
        '.nextjs-toast',
        '#__NEXT_DEV_TOOLTIP__',
        'body > div:last-child:not(:first-child)',
        'div[style*="position: fixed"][style*="bottom"]',
        'div[style*="position:fixed"][style*="bottom"]',
        'button[style*="position: fixed"][style*="bottom"]',
        'a[aria-label*="Next.js"]',
        '.n-badge',
        '.n-icon',
        '.n-wrapper',
        '.n-circle'
      ];
      
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          if (el instanceof HTMLElement) {
            try {
              el.style.display = 'none';
              el.style.opacity = '0';
              el.style.visibility = 'hidden';
              el.remove(); // Intentar remover completamente
            } catch (e) {
              // Ignorar errores si no se puede eliminar
            }
          }
        });
      });
    };

    // Ejecutar inmediatamente
    removeNextLogo();
    
    // Configurar eliminación periódica
    const interval = setInterval(removeNextLogo, 500);
    
    // También ejecutar cuando cambia la ruta o se carga completamente la página
    window.addEventListener('load', removeNextLogo);
    window.addEventListener('popstate', removeNextLogo);
    
    // Limpiar al desmontar
    return () => {
      clearInterval(interval);
      window.removeEventListener('load', removeNextLogo);
      window.removeEventListener('popstate', removeNextLogo);
    };
  }, []);

  return null;
} 