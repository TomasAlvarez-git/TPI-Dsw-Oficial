import { useEffect } from 'react';

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="
      fixed
      bottom-6
      right-6
      bg-green-500
      text-white
      px-4
      py-2
      rounded-lg
      shadow-lg
      animate-fadeIn
    ">
      {message}
    </div>
  );
}
