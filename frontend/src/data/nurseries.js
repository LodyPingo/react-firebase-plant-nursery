// src/data/nurseries.js

let nurseries = [
  {
    id: 1,
    name: "مشتل الزهور",
    image: "https://via.placeholder.com/100x100?text=Flowers",
    categories: ["زهور", "مشاتل مختلطة"],
    location: "الدمام - حي الفيصليّة",
    services: ["delivery", "consultation", "maintenance"],
    featured: false,
    discount: 25
  },
  {
    id: 2,
    name: "مشتل النخيل",
    image: "https://via.placeholder.com/100x100?text=Palm",
    categories: ["نخيل", "مشاتل"],
    location: "جدة - حي الصفا",
    services: ["delivery", "installation", "consultation"],
    featured: false,
    discount: null
  },
  {
    id: 3,
    name: "مشتل الربيع",
    image: "https://via.placeholder.com/100x100?text=Spring",
    categories: ["نباتات داخلية", "مشاتل"],
    location: "الرياض - حي النخيل",
    services: ["delivery", "consultation", "maintenance", "installation"],
    featured: true,
    discount: null
  },
  {
    id: 4,
    name: "مشتل الأخضر",
    image: "https://via.placeholder.com/100x100?text=Green",
    categories: ["مشاتل مختلطة"],
    location: "جدة - حي النزهة",
    services: ["delivery", "installation", "maintenance"],
    featured: true,
    discount: null
  },
  {
    id: 5,
    name: "متجر أدوات الحديقة",
    image: "https://via.placeholder.com/100x100?text=Tools",
    categories: ["معدات", "أدوات الزراعة"],
    location: "الرياض - حي الملك فهد",
    services: ["delivery", "maintenance"],
    featured: false,
    discount: null
  },
  {
    id: 6,
    name: "مشتل البستان",
    image: "https://via.placeholder.com/100x100?text=Garden",
    categories: ["نباتات خارجية", "مشاتل"],
    location: "المدينة - حي العزيزية",
    services: ["delivery", "consultation", "maintenance"],
    featured: false,
    discount: null
  }
];

export { nurseries };

// Utility to add a new nursery
export const addNursery = (newNursery) => {
  const id = Math.max(...nurseries.map(n => n.id)) + 1;
  const nursery = { id, ...newNursery };
  nurseries.push(nursery);
  return nursery;
};