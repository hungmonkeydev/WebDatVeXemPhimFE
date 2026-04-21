import { useEffect } from 'react';

export default function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    // 1. Tính độ rộng của thanh cuộn trên máy người dùng
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isLocked]);
}