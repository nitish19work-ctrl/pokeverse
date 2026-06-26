import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function RippleButton({
  children,
  onClick,
  to,
  variant = 'primary',
  className = '',
  ...props
}) {
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    ripple.classList.add('ripple');
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    onClick?.(e);
  };

  const variants = {
    primary: 'bg-gradient-to-r from-poke-yellow to-yellow-400 text-poke-dark font-bold hover:shadow-lg hover:shadow-poke-yellow/30',
    secondary: 'glass text-white hover:bg-white/10 border border-white/20',
    danger: 'bg-gradient-to-r from-poke-red to-red-500 text-white font-bold hover:shadow-lg hover:shadow-poke-red/30',
    ghost: 'text-gray-300 hover:text-white hover:bg-white/5',
  };

  const classes = `relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 cursor-pointer ${variants[variant]} ${className}`;

  if (to) {
    const { disabled, ...linkProps } = props;
    return (
      <motion.div whileHover={{ scale: disabled ? 1 : 1.05 }} whileTap={{ scale: disabled ? 1 : 0.95 }}>
        <Link
          to={to}
          className={`${classes}${disabled ? ' opacity-50 pointer-events-none' : ''}`}
          ref={buttonRef}
          onClick={handleClick}
          {...linkProps}
        >
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      ref={buttonRef}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={classes}
      onClick={handleClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}
