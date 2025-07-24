import Logo from './Logo';

const HeroLogo = () => {
  return (
    <div className="flex items-center justify-center mb-2 sm:mb-3">
      <Logo isHero />
    </div>
  );
};

export default HeroLogo;