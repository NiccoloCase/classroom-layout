import * as React from "react";

/**
 * Hook che chiama la funzione callback passata quando il client clicca 
 * un elemento esterno a quello passato come referenza
 */
export function useOutsideClickDetector(ref: React.RefObject<HTMLElement>, callback: () => void) {
  React.useEffect(() => {

    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target))
        callback();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);

  }, [ref]);
}