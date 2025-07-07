const HeroLogo = () => {
  return (
    <div className="flex items-center justify-center mb-2 sm:mb-3">
      {/* Light mode logo - visible in light mode, hidden in dark mode */}
      <img
        src="/lovable-uploads/29637275-f42b-4415-b255-b8ae5e5837e1.png"
        alt="PartMatch Logo"
        className="h-48 sm:h-56 md:h-64 lg:h-72 w-auto object-contain dark:hidden"
      />
      {/* Dark mode logo - hidden in light mode, visible in dark mode with brightness filter */}
      <img
        src="/lovable-uploads/29637275-f42b-4415-b255-b8ae5e5837e1.png"
        alt="PartMatch Logo"
        className="hidden dark:block h-48 sm:h-56 md:h-64 lg:h-72 w-auto object-contain brightness-[3] contrast-125 saturate-0"
      />
    </div>
  );
};

export default HeroLogo;