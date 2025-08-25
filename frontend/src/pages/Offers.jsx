import { useState, useEffect } from 'react';
import OfferCard from '../components/OfferCard';
import { offers } from '../data/offers';

const Offers = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // 🔍 Filter & Sort State
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // 🔎 Filtered and sorted offers
  const filteredOffers = offers.filter((offer) => {
    // Filter by type
    if (filterType !== 'all') {
      if (filterType === 'discount' && offer.discount === null) return false;
      if (filterType === 'free_delivery' && !offer.tags.includes('توصيل')) return false;
      if (filterType === 'consultation' && !offer.tags.includes('استشارات')) return false;
    }

    // Filter by category
    if (filterCategory !== 'all') {
      if (!offer.tags.includes(filterCategory)) return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'popular') return (b.highlighted ? 1 : 0) - (a.highlighted ? 1 : 0);
    if (sortBy === 'lowest_price' && a.discount !== null && b.discount !== null) {
      return a.discount - b.discount;
    }
    return 0;
  });

  const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterType, filterCategory, sortBy]);

  const currentOffers = filteredOffers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-orange-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            العروض الخاصة 🎁
          </h1>
          <p className="text-xl mb-8">
            اكتشف أفضل العروض والخصومات من المشاتل المميزة
          </p>
          <button className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors">
            {filteredOffers.length} عرض نشط حالياً 🙌
          </button>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex flex-wrap gap-4 items-center justify-center">
              {/* Filter by Type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md min-w-36"
              >
                <option value="all">جميع العروض</option>
                <option value="discount">خصومات</option>
                <option value="free_delivery">توصيل مجاني</option>
                <option value="consultation">استشارات مجانية</option>
              </select>

              {/* Filter by Category */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md min-w-36"
              >
                <option value="all">جميع التصنيفات</option>
                <option value="نباتات داخلية">نباتات داخلية</option>
                <option value="نباتات خارجية">نباتات خارجية</option>
                <option value="زهور">زهور</option>
                <option value="أدوات زراعة">أدوات زراعة</option>
                <option value="خدمات">خدمات</option>
              </select>

              {/* Sort by */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md min-w-36"
              >
                <option value="newest">الأحدث أولاً</option>
                <option value="popular">الأكثر شعبية</option>
                <option value="lowest_price">أقل السعر</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Offers Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentOffers.length > 0 ? (
              currentOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500 py-8">
                لا توجد عروض مطابقة للبحث.
              </p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
              >
                السابق
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === i + 1
                      ? 'bg-orange-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Offers;