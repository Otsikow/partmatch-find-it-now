
const StatsSection = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">1000+</div>
          <div className="text-gray-600">Happy Customers</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-bold text-yellow-600 mb-2">500+</div>
          <div className="text-gray-600">Verified Sellers</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">10,000+</div>
          <div className="text-gray-600">Parts Listed</div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-2">16</div>
          <div className="text-gray-600">Regions Covered</div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
