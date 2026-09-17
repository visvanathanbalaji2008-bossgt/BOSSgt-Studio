import { useEffect } from 'react';

export const emitEvent = (eventName: string, payload?: any) => {
  const event = new CustomEvent(eventName, { detail: payload });
  window.dispatchEvent(event);
};

export const useListenEvent = (eventName: string, callback: (payload: any) => void) => {
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      callback(customEvent.detail);
    };
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName, callback]);
};
