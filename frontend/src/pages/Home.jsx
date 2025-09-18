// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import defaultNurseryImage from '../assets/nurs_empty.png';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('home'); // 'home' or 'category-results'
  const [sponsors, setSponsors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nurseries, setNurseries] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sponsorsLoading, setSponsorsLoading] = useState(true);
  const [results, setResults] = useState([]);

  // ✅ New: Site Settings
  const [siteSettings, setSiteSettings] = useState({
    title: 'أكبر منصة للمشاتل في المملكة 🌿',
    subtitle: 'اكتشف أكثر من 500 مشتل ومتجر لأدوات الزراعة في مكان واحد',
    heroImage: 'https://placehold.co/1200x600/10b981/ffffff?text=Hero+Image',
    benefits: ['توصيل سريع', 'أفضل الأسعار', 'استشارات مجانية', 'دعم فني متاح'],
    contacts: {
      whatsapp: '966551234567'
    }
  });

  // ✅ Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const API_BASE = 'https://react-firebase-plant-nursery-production.up.railway.app';
        const response = await fetch(`${API_BASE}/api/settings/site`);
        if (!response.ok) throw new Error('فشل تحميل إعدادات الموقع');
        const data = await response.json();
        setSiteSettings(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.warn('Using default site settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // ✅ Keep your existing fetch effects for nurseries, offers, etc.
  // (No changes needed below unless specified)

  useEffect(() => {
    const fetchNurseries = async () => {
      try {
        const API_BASE = 'https://react-firebase-plant-nursery-production.up.railway.app';
        const response = await fetch(`${API_BASE}/api/nurseries`);
        if (!response.ok) throw new Error('فشل تحميل المشاتل');
        const data = await response.json();
        setNurseries(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching nurseries:', err);
        setNurseries([]);
      }
    };
    fetchNurseries();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const API_BASE = 'https://react-firebase-plant-nursery-production.up.railway.app';
        const response = await fetch(`${API_BASE}/api/offers`);
        if (!response.ok) throw new Error('فشل تحميل العروض');
        const data = await response.json();
        setOffers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching offers:', err);
        setOffers([]);
      }
    };
    fetchOffers();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const API_BASE = 'https://react-firebase-plant-nursery-production.up.railway.app';
        const response = await fetch(`${API_BASE}/api/categories`);
        if (!response.ok) throw new Error('فشل تحميل التصنيفات');
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const API_BASE = 'https://react-firebase-plant-nursery-production.up.railway.app';
        const response = await fetch(`${API_BASE}/api/sponsors`);
        if (!response.ok) throw new Error('فشل تحميل الرعاة');
        const data = await response.json();
        setSponsors(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching sponsors:', err);
        setSponsors([]);
      } finally {
        setSponsorsLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  // ✅ Search logic remains unchanged...
  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return setResults([]);

    const results = [];
    // Nurseries search
    nurseries.forEach(n => {
      if (
        n.name.toLowerCase().includes(term) ||
        n.location.toLowerCase().includes(term) ||
        n.categories.some(cat => cat.toLowerCase().includes(term)) ||
        n.services.some(svc => svc.toLowerCase().includes(term))
      ) {
        results.push({
          type: 'nursery',
          id: n.id,
          title: n.name,
          subtitle: n.location,
          link: `/nurseries/${n.id}`,
          tags: n.categories.slice(0, 2)
        });
      }
    });

    // Offers search
    offers.forEach(o => {
      if (
        o.title.toLowerCase().includes(term) ||
        o.description.toLowerCase().includes(term) ||
        o.tags?.some(tag => tag.toLowerCase().includes(term)) ||
        o.nurseryName?.toLowerCase().includes(term)
      ) {
        results.push({
          type: 'offer',
          id: o.id,
          title: o.title,
          subtitle: `من: ${o.nurseryName || 'عرض عام'}`,
          link: `/offers/${o.id}`,
          tags: o.tags?.slice(0, 2) || []
        });
      }
    });

    // Categories search
    categories.forEach(c => {
      if (
        c.title.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      ) {
        results.push({
          type: 'category',
          id: c.id,
          title: c.title,
          subtitle: 'تصنيف متاح',
          link: '/nurseries',
          tags: ['تصنيف']
        });
      }
    });

    setResults(results);
  }, [searchTerm, nurseries, offers, categories]);

  const filters = [
    { key: 'all', label: 'الكل' },
    { key: 'category', label: 'تصنيفات' },
    { key: 'service', label: 'خدمات' }
  ];

  const filteredResults = results.filter(result => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'category') return result.type === 'category';
    if (activeFilter === 'service') return ['nursery', 'offer'].includes(result.type);
    return true;
  });

  if (loading || sponsorsLoading) {
    return <p className="text-center py-8">جاري التحميل...</p>;
  }

  const featuredNurseries = nurseries.filter(n => n.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section 
        className="bg-gradient-to-r from-green-100 to-green-200 py-16"
        style={{ backgroundImage: `url(${siteSettings.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="container mx-auto px-4 text-center relative bg-black bg-opacity-50 text-white py-10 rounded-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {siteSettings.title}
          </h1>
          <p className="text-xl mb-8">
            {siteSettings.subtitle}
          </p>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {siteSettings.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-800">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rest of your page remains the same... */}
      {/* Search, Categories, Featured, Sponsors etc. */}
      
      {/* Search Section */}
      <section className="py-8">
        {/* Keep your existing search form */}
      </section>

      {/* Categories Grid */}
      {viewMode === 'home' && (
        <section className="py-12 bg-white">
          {/* Keep as-is */}
        </section>
      )}

      {/* Featured Nurseries */}
      {viewMode === 'home' && featuredNurseries.length > 0 && (
        <section className="py-12">
          {/* Keep as-is */}
        </section>
      )}

      {/* Category Results */}
      {viewMode === 'category-results' && selectedCategory && (
        <section className="py-12 bg-white">
          {/* Keep as-is */}
        </section>
      )}

      {/* Premium Nurseries */}
      {viewMode === 'home' && (
        <section className="py-12 bg-gray-900 text-white">
          {/* Keep as-is */}
        </section>
      )}

      {/* Sponsors Banner */}
      {viewMode === 'home' && (
        <section className="py-12 bg-gradient-to-r from-amber-50 to-yellow-50">
          {/* Keep as-is */}
        </section>
      )}
    </div>
  );
};

export default Home;