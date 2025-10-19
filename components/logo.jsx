export const Logo = ({ className = 'h-10 w-auto' }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 250 40"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CochesToday Logo"
    >
      <text
        x="0"
        y="30"
        fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        fontSize="32"
        fontWeight="bold"
        // Use Tailwind classes for theme-aware colors
        className="fill-gray-800 dark:fill-white"
      >
        Coches
        <tspan
          // The gold color remains constant in both themes
          className="fill-amber-400"
          fontWeight="semibold"
        >
          Today
        </tspan>
      </text>
    </svg>
  );
};