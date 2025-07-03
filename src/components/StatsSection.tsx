
const StatsSection = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
        <div className="p-4">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-1 sm:mb-2">1000+</div>
          <div className="text-sm sm:text-base text-gray-600">Happy Customers</div>
        </div>
        <div className="p-4">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-600 mb-1 sm:mb-2">500+</div>
          <div className="text-sm sm:text-base text-gray-600">Verified Sellers</div>
        </div>
        <div className="p-4">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-1 sm:mb-2">10,000+</div>
          <div className="text-sm sm:text-base text-gray-600">Parts Listed</div>
        </div>
        <div className="p-4">
          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600 mb-1 sm:mb-2">16</div>
          <div className="text-sm sm:text-base text-gray-600">Regions Covered</div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
