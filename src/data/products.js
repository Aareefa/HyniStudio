
const products = [
  {
    id: 1,
    code: "KU101",
    name: "Floral Cotton Kurti",
    category: "Kurtis",
    price: 1299,
    oldPrice: 1699,
    rating: 4.8,
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Rose Pink", "Raspberry", "Cream"],
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e4?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 2,
    code: "SA201",
    name: "Elegant Silk Saree",
    category: "Sarees",
    price: 3499,
    oldPrice: 4299,
    rating: 4.9,
    badge: "Popular",
    sizes: ["Free Size"],
    colors: ["Rose Pink", "Deep Plum"],
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 3,
    code: "GW301",
    name: "Evening Party Gown",
    category: "Gowns",
    price: 5199,
    oldPrice: 6499,
    rating: 4.7,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Plum", "Rose Pink"],
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 4,
    code: "TP401",
    name: "Modern Top and Pants",
    category: "Tops & Pants",
    price: 1599,
    oldPrice: 1999,
    rating: 4.6,
    badge: "Trending",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Rose Pink"],
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 5,
    code: "CO501",
    name: "Printed Co-ord Set",
    category: "Co-ord Sets",
    price: 1899,
    oldPrice: 2399,
    rating: 4.7,
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rose Pink", "Cream"],
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 6,
    code: "KU102",
    name: "Traditional Embroidered Kurti",
    category: "Kurtis",
    price: 2199,
    oldPrice: 2799,
    rating: 4.8,
    badge: "Popular",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Deep Plum", "Rose Pink"],
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 7,
    code: "SA202",
    name: "Festive Traditional Saree",
    category: "Sarees",
    price: 4299,
    oldPrice: 4999,
    rating: 4.9,
    badge: "Premium",
    sizes: ["Free Size"],
    colors: ["Rose Pink", "Cream"],
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 8,
    code: "CO502",
    name: "Contemporary Boutique Set",
    category: "Co-ord Sets",
    price: 1999,
    oldPrice: 2499,
    rating: 4.6,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Deep Plum"],
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 9,
    code: "DR601",
    name: "Floral Everyday Dress",
    category: "Dresses",
    price: 1799,
    oldPrice: 2299,
    rating: 4.7,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rose Pink", "Cream"],
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 10,
    code: "LE701",
    name: "Embroidered Festive Lehenga",
    category: "Lehengas",
    price: 5999,
    oldPrice: 7499,
    rating: 4.9,
    badge: "Premium",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Plum", "Rose Pink"],
    image:
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 11,
    code: "SS801",
    name: "Printed Salwar Suit Set",
    category: "Salwar Suits",
    price: 2499,
    oldPrice: 3199,
    rating: 4.7,
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Cream", "Rose Pink"],
    image:
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 12,
    code: "ET901",
    name: "Embroidered Ethnic Set",
    category: "Ethnic Sets",
    price: 2899,
    oldPrice: 3599,
    rating: 4.8,
    badge: "Trending",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Plum", "Cream"],
    image:
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 13,
    code: "DU1001",
    name: "Lightweight Occasion Dupatta",
    category: "Dupattas",
    price: 999,
    oldPrice: 1399,
    rating: 4.6,
    badge: "New Arrival",
    sizes: ["Free Size"],
    colors: ["Rose Pink", "Cream", "Deep Plum"],
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 14,
    code: "KU103",
    name: "Printed Rayon Kurti",
    category: "Kurtis",
    price: 1499,
    oldPrice: 1899,
    rating: 4.6,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Rose Pink", "Cream"],
    image:
      "https://images.unsplash.com/photo-1583391733981-8498405f9c7b?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 15,
    code: "SA203",
    name: "Pastel Festive Saree",
    category: "Sarees",
    price: 3199,
    oldPrice: 3899,
    rating: 4.8,
    badge: "Trending",
    sizes: ["Free Size"],
    colors: ["Rose Pink", "Cream"],
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 16,
    code: "GW302",
    name: "Luxury Evening Gown",
    category: "Gowns",
    price: 6299,
    oldPrice: 7499,
    rating: 4.9,
    badge: "Premium",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Plum", "Rose Pink"],
    image:
      "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 17,
    code: "GW303",
    name: "Embellished Occasion Gown",
    category: "Gowns",
    price: 5799,
    oldPrice: 6899,
    rating: 4.7,
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Plum", "Cream"],
    image:
      "https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 18,
    code: "TP402",
    name: "Chic Everyday Top and Pants",
    category: "Tops & Pants",
    price: 1799,
    oldPrice: 2199,
    rating: 4.5,
    badge: "Popular",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Rose Pink"],
    image:
      "https://images.unsplash.com/photo-1551163943-3f6a855d1153?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 19,
    code: "TP403",
    name: "Relaxed Fit Top and Trousers",
    category: "Tops & Pants",
    price: 1999,
    oldPrice: 2499,
    rating: 4.6,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Plum", "Cream"],
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 20,
    code: "CO503",
    name: "Soft Print Co-ord Set",
    category: "Co-ord Sets",
    price: 2199,
    oldPrice: 2699,
    rating: 4.7,
    badge: "Trending",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rose Pink", "Cream"],
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 21,
    code: "DR602",
    name: "Rose Evening Dress",
    category: "Dresses",
    price: 2299,
    oldPrice: 2799,
    rating: 4.8,
    badge: "Popular",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rose Pink", "Deep Plum"],
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 22,
    code: "DR603",
    name: "Classic Midi Dress",
    category: "Dresses",
    price: 1899,
    oldPrice: 2399,
    rating: 4.6,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Rose Pink"],
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 23,
    code: "LE702",
    name: "Graceful Wedding Lehenga",
    category: "Lehengas",
    price: 7299,
    oldPrice: 8499,
    rating: 4.9,
    badge: "Premium",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Plum", "Rose Pink"],
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 24,
    code: "LE703",
    name: "Festive Embroidered Lehenga",
    category: "Lehengas",
    price: 6799,
    oldPrice: 7999,
    rating: 4.8,
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rose Pink", "Cream"],
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 25,
    code: "SS802",
    name: "Everyday Printed Salwar Suit",
    category: "Salwar Suits",
    price: 2299,
    oldPrice: 2799,
    rating: 4.6,
    badge: "Popular",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Cream", "Rose Pink"],
    image:
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 26,
    code: "SS803",
    name: "Embroidered Festive Suit Set",
    category: "Salwar Suits",
    price: 3299,
    oldPrice: 3999,
    rating: 4.8,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Deep Plum", "Cream"],
    image:
      "https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 27,
    code: "ET902",
    name: "Printed Three-piece Ethnic Set",
    category: "Ethnic Sets",
    price: 3199,
    oldPrice: 3799,
    rating: 4.7,
    badge: "Trending",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Rose Pink", "Cream"],
    image:
      "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 28,
    code: "ET903",
    name: "Contemporary Ethnic Co-ord",
    category: "Ethnic Sets",
    price: 2799,
    oldPrice: 3399,
    rating: 4.6,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Deep Plum", "Cream"],
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 29,
    code: "DU1002",
    name: "Floral Embroidered Dupatta",
    category: "Dupattas",
    price: 1299,
    oldPrice: 1699,
    rating: 4.7,
    badge: "Popular",
    sizes: ["Free Size"],
    colors: ["Rose Pink", "Cream"],
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e4?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 30,
    code: "DU1003",
    name: "Lightweight Festive Dupatta",
    category: "Dupattas",
    price: 1599,
    oldPrice: 1999,
    rating: 4.8,
    badge: "Bestseller",
    sizes: ["Free Size"],
    colors: ["Deep Plum", "Rose Pink"],
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=700&q=85"
  },
  {
    id: 31,
    code: "SAR105",
    name: "Embellished Festive Saree",
    category: "Sarees",
    price: 5299,
    oldPrice: 6299,
    rating: 4.8,
    badge: "New Arrival",
    sizes: ["Free Size"],
    colors: ["Deep Plum", "Rose Pink"],
    image: "/images/catalog/products/saree-05.jpg"
  },
  {
    id: 32,
    code: "FRK502",
    name: "Burgundy Tiered Maxi Frock",
    category: "Frocks",
    price: 3299,
    oldPrice: 3999,
    rating: 4.8,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Burgundy"],
    image: "/images/catalog/products/frock-01.jpg"
  },
  {
    id: 33,
    code: "FRK503",
    name: "Burgundy Satin Party Frock",
    category: "Frocks",
    price: 4599,
    oldPrice: 5499,
    rating: 4.9,
    badge: "Popular",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Burgundy"],
    image: "/images/catalog/products/frock-02.jpg"
  },
  {
    id: 34,
    code: "FRK504",
    name: "Navy Blue Evening Frock",
    category: "Frocks",
    price: 4299,
    oldPrice: 5199,
    rating: 4.8,
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy Blue"],
    image: "/images/catalog/products/frock-03.jpg"
  },
  {
    id: 35,
    code: "FRK505",
    name: "Black Off-Shoulder Evening Frock",
    category: "Frocks",
    price: 4899,
    oldPrice: 5799,
    rating: 4.7,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    image: "/images/catalog/products/frock-04.jpg"
  },
  {
    id: 36,
    code: "FRK506",
    name: "Black and Ivory Gown Frock",
    category: "Frocks",
    price: 5199,
    oldPrice: 6199,
    rating: 4.8,
    badge: "Premium",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Ivory"],
    image: "/images/catalog/products/frock-05.jpg"
  },
  {
    id: 37,
    code: "LFR304",
    name: "Blush Pink Tulle Ball Gown",
    category: "Frocks",
    price: 6499,
    oldPrice: 7499,
    rating: 4.9,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blush Pink"],
    image: "/images/catalog/products/long-frock-01.jpg"
  },
  {
    id: 38,
    code: "LFR305",
    name: "Burgundy Ombre Evening Gown",
    category: "Frocks",
    price: 5999,
    oldPrice: 6999,
    rating: 4.8,
    badge: "Popular",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Burgundy", "Black"],
    image: "/images/catalog/products/long-frock-02.jpg"
  },
  {
    id: 39,
    code: "LFR306",
    name: "Burgundy Draped Evening Gown",
    category: "Frocks",
    price: 5499,
    oldPrice: 6499,
    rating: 4.8,
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Burgundy"],
    image: "/images/catalog/products/long-frock-03.jpg"
  },
  {
    id: 40,
    code: "LFR307",
    name: "Ice Blue Draped Long Gown",
    category: "Frocks",
    price: 5799,
    oldPrice: 6799,
    rating: 4.7,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ice Blue"],
    image: "/images/catalog/products/long-frock-04.jpg"
  },
  {
    id: 41,
    code: "SFR805",
    name: "Sky Blue Butterfly Party Frock",
    category: "Frocks",
    price: 2799,
    oldPrice: 3399,
    rating: 4.8,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Sky Blue"],
    image: "/images/catalog/products/short-frock-01.jpg"
  },
  {
    id: 42,
    code: "SFR806",
    name: "Ivory Off-Shoulder Party Frock",
    category: "Frocks",
    price: 3199,
    oldPrice: 3799,
    rating: 4.8,
    badge: "Popular",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ivory"],
    image: "/images/catalog/products/short-frock-02.jpg"
  },
  {
    id: 43,
    code: "SFR807",
    name: "Burgundy Puff-Sleeve Short Frock",
    category: "Frocks",
    price: 2999,
    oldPrice: 3599,
    rating: 4.9,
    badge: "Bestseller",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Burgundy"],
    image: "/images/catalog/products/short-frock-03.jpg"
  },
  {
    id: 44,
    code: "SFR808",
    name: "Blush Pink Sequin Short Frock",
    category: "Frocks",
    price: 3299,
    oldPrice: 3899,
    rating: 4.7,
    badge: "New Arrival",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blush Pink"],
    image: "/images/catalog/products/short-frock-04.jpg"
  }
];

const wardrobeDetails = [
  ["Sarees", "Rose Zari Silk Saree", "SAR101"],
  ["Sarees", "Deep Plum Festive Saree", "SAR102"],
  ["Long Frocks", "Rose Evening Long Frock", "LFR301"],
  ["Tops", "Structured Rose Top", "TOP401"],
  ["Frocks", "Printed Boutique Frock", "FRK501"],
  ["Kurtas", "Embroidered Straight Kurta", "KUR601"],
  ["Jeans", "Wide-Leg Blue Jeans", "SJ701"],
  ["Short Frocks", "Cream Floral Short Frock", "SFR801"],
  ["Short Frocks", "Raspberry Party Short Frock", "SFR802"],
  ["Anarkali", "Embroidered Anarkali Dress", "AN901"],
  ["Punjabi", "Printed Punjabi Suit", "PUN1001"],
  ["Patiala", "Rose Patiala Set", "PAT1101"],
  ["Sarees", "Lightweight Occasion Saree", "SAR103"],
  ["Kurtas", "Printed Rayon Kurta", "KUR602"],
  ["Sarees", "Pastel Festive Saree", "SAR104"],
  ["Long Frocks", "Luxury Evening Long Frock", "LFR302"],
  ["Long Frocks", "Embellished Long Frock", "LFR303"],
  ["Tank Tops", "Navy Square-Neck Tank Top", "TN1201"],
  ["Shirts", "Rose Plaid Wrap Shirt", "SH1601"],
  ["Skirts", "Soft Print Midi Skirt", "SK501"],
  ["Short Frocks", "Rose Short Frock", "SFR803"],
  ["Short Frocks", "Classic Short Frock", "SFR804"],
  ["Anarkali", "Graceful Wedding Anarkali", "AN902"],
  ["Patiala", "Festive Patiala Set", "PAT1102"],
  ["Punjabi", "Everyday Punjabi Suit", "PUN1002"],
  ["Punjabi", "Festive Embroidered Punjabi Suit", "PUN1003"],
  ["T-shirts", "Navy Collared T-shirt", "TSH1501"],
  ["Crop Tops", "Cherry Print Puff-Sleeve Crop Top", "CRP1301"],
  ["Tank Tops", "Lilac Gingham Halter Top", "TN1202"],
  ["Short Tops", "Ivory Button Peplum Short Top", "ST1401"],
  ["Sarees", "Embellished Festive Saree", "SAR105"],
  ["Frocks", "Burgundy Tiered Maxi Frock", "FRK502"],
  ["Frocks", "Burgundy Satin Party Frock", "FRK503"],
  ["Frocks", "Navy Blue Evening Frock", "FRK504"],
  ["Frocks", "Black Off-Shoulder Evening Frock", "FRK505"],
  ["Frocks", "Black and Ivory Gown Frock", "FRK506"],
  ["Frocks", "Blush Pink Tulle Ball Gown", "LFR304"],
  ["Frocks", "Burgundy Ombre Evening Gown", "LFR305"],
  ["Frocks", "Burgundy Draped Evening Gown", "LFR306"],
  ["Frocks", "Ice Blue Draped Long Gown", "LFR307"],
  ["Frocks", "Sky Blue Butterfly Party Frock", "SFR805"],
  ["Frocks", "Ivory Off-Shoulder Party Frock", "SFR806"],
  ["Frocks", "Burgundy Puff-Sleeve Short Frock", "SFR807"],
  ["Frocks", "Blush Pink Sequin Short Frock", "SFR808"]
];

const productPhotoFiles = {
  SAR101: "saree-01.jpg",
  SAR102: "saree-02.jpg",
  LFR301: "LFR301.jpg",
  TOP401: "TOP401.jpg",
  FRK501: "FRK501.jpg",
  KUR601: "KUR601.jpg",
  SJ701: "jeans-01.png",
  SFR801: "SFR801.jpg",
  SFR802: "SFR802.jpg",
  AN901: "anarkali-01.png",
  PUN1001: "punjabi-01.png",
  PAT1101: "patiala-01.png",
  SAR103: "saree-03.jpg",
  KUR602: "KUR602.jpg",
  SAR104: "saree-04.jpg",
  SAR105: "saree-05.jpg",
  LFR302: "LFR302.jpg",
  LFR303: "LFR303.jpg",
  TN1201: "tanktop-01.png",
  SH1601: "shirt-01.png",
  SK501: "SK501.jpg",
  SFR803: "SFR803.jpg",
  SFR804: "SFR804.jpg",
  AN902: "anarkali-02.png",
  PAT1102: "patiala-02.png",
  PUN1002: "punjabi-02.png",
  TSH1501: "tshirt-01.png",
  CRP1301: "croptop-01.png",
  TN1202: "tanktop-02.png",
  ST1401: "shorttop-01.png",
  CRP1302: "croptop-02.png",
  ST1402: "shorttop-02.png",
  TSH1502: "tshirt-02.png",
  SH1602: "shirt-02.png",
  FRK502: "frock-01.jpg",
  FRK503: "frock-02.jpg",
  FRK504: "frock-03.jpg",
  FRK505: "frock-04.jpg",
  FRK506: "frock-05.jpg",
  LFR304: "long-frock-01.jpg",
  LFR305: "long-frock-02.jpg",
  LFR306: "long-frock-03.jpg",
  LFR307: "long-frock-04.jpg",
  SFR805: "short-frock-01.jpg",
  SFR806: "short-frock-02.jpg",
  SFR807: "short-frock-03.jpg",
  SFR808: "short-frock-04.jpg"
};

products.forEach((product, index) => {
  const [category, name, code] = wardrobeDetails[index];
  product.category = category;
  product.name = name;
  product.code = code;
  product.image = `/images/catalog/products/${productPhotoFiles[code]}`;
});

const retiredProductCodes = new Set([
  "LFR301",
  "FRK501",
  "SFR801",
  "SFR802",
  "LFR302",
  "LFR303",
  "SFR803",
  "SFR804",
  "PUN1003"
]);
const catalogProducts = products.filter(
  (product) => !retiredProductCodes.has(product.code)
);

const jeansProduct = catalogProducts.find((product) => product.code === "SJ701");
if (!jeansProduct) {
  throw new Error("The catalog must include the SJ701 jeans product.");
}
catalogProducts.push({
  ...jeansProduct,
  id: Math.max(...catalogProducts.map((product) => product.id)) + 1,
  code: "SJ702",
  name: "Flared Blue Jeans",
  image: "/images/catalog/products/jeans-02.png"
});

const addCategoryProduct = (category, code, name) => {
  const sourceProduct = catalogProducts.find(
    (product) => product.category === category
  );
  if (!sourceProduct) {
    throw new Error(`The catalog must include a ${category} product.`);
  }

  catalogProducts.push({
    ...sourceProduct,
    id: Math.max(...catalogProducts.map((product) => product.id)) + 1,
    code,
    name,
    image: `/images/catalog/products/${productPhotoFiles[code]}`
  });
};

addCategoryProduct("Crop Tops", "CRP1302", "Cream Cape Crop Top");
addCategoryProduct("Short Tops", "ST1402", "White Eyelet Puff-Sleeve Top");
addCategoryProduct("T-shirts", "TSH1502", "Navy Ruched Tie T-shirt");
addCategoryProduct("Shirts", "SH1602", "Navy Plaid Wrap Shirt");

export const categories = [
  "All",
  "Sarees",
  "Frocks",
  "Skirts",
  "Tops",
  "Kurtas",
  "Punjabi",
  "Anarkali",
  "Patiala",
  "Jeans",
  "Crop Tops",
  "Tank Tops",
  "Short Tops",
  "T-shirts",
  "Shirts"
];

export const toCategorySlug = (category) =>
  category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const categoryImages = Object.fromEntries(
  categories.map((category) => [
    category,
    category === "Frocks"
      ? catalogProducts.find((product) => product.code === "SFR805")?.image
      : catalogProducts.find((product) => product.category === category)?.image
        || catalogProducts[0].image
  ])
);

export default catalogProducts;
