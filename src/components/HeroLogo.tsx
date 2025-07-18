const HeroLogo = () => {
  return (
    <div className="flex items-center justify-center mb-2 sm:mb-3">
      {/* Professional PartMatch logo for light mode */}
      <img
        src="/lovable-uploads/0bb9488b-2f77-4f4c-b8b3-8aa9343b1d18.png"
        alt="PartMatch - Car Parts Marketplace"
        className="h-48 sm:h-56 md:h-64 lg:h-72 w-auto object-contain dark:hidden"
      />
      {/* Professional PartMatch logo for dark mode with brightness adjustment */}
      <img
        src="/lovable-uploads/0bb9488b-2f77-4f4c-b8b3-8aa9343b1d18.png"
        alt="PartMatch - Car Parts Marketplace"
        className="hidden dark:block h-48 sm:h-56 md:h-64 lg:h-72 w-auto object-contain"
      />
    </div>
  );
};

export default HeroLogo;