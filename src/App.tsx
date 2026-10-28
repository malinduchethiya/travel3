/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

type MarketCode = 'uk' | 'in';
type JourneyKey = 'hill' | 'south';
type FilterCategory = 'all' | 'culture' | 'coast' | 'wildlife' | 'tea';

const ASSETS = {
  heroSigiriya: '/assets/aistudio/hero-sigiriya_abfd93be.jpg',
  journeyHill: '/assets/aistudio/journey-hill_1077fe41.jpg',
  journeyCoast: '/assets/aistudio/journey-coast_55d1c266.jpg',
  islandTemple: '/assets/aistudio/island-temple_f370d2d0.jpg',
  islandWildlife: '/assets/aistudio/island-wildlife_adaadda8.jpg',
  coastMirissa: '/assets/aistudio/coast-mirissa_22cac647.jpg',
  coastFisher: '/assets/aistudio/coast-fisher_b5368c31.jpg',
  islandTea: '/assets/aistudio/island-tea_4af43e81.jpg',
};

const MARKETS: Record<MarketCode, { name: string; code: string; locale: string; currency: string }> = {
  uk: { name: 'United Kingdom', code: 'GBP', locale: 'en-GB', currency: 'GBP' },
  in: { name: 'India', code: 'INR', locale: 'en-IN', currency: 'INR' },
};

const formatMoney = (value: number, code: MarketCode) => {
  const m = MARKETS[code] || MARKETS.uk;
  return new Intl.NumberFormat(m.locale, {
    style: 'currency',
    currency: m.currency,
    maximumFractionDigits: 0,
  }).format(value);
};

interface JourneyData {
  num: string;
  kicker: string;
  title: string;
  sub: string;
  meta: { label: string; value: string }[];
  price: { uk: number; in: number };
  days: { title: string; place: string; text: string }[];
  included: string[];
  excluded: string[];
}

const JOURNEYS: Record<JourneyKey, JourneyData> = {
  hill: {
    num: '01',
    kicker: 'Journey one · United Kingdom',
    title: 'The Hill Country Line',
    sub: 'Eight days from Colombo to Galle by way of the tea country — the long way round, the slow way in. Built around the overnight flight from London and the small pleasure of having nowhere to be by noon.',
    meta: [
      { label: 'Length', value: '8 days · 7 nights' },
      { label: 'Party', value: 'Private · 2–6 guests' },
      { label: 'Flights', value: 'London Heathrow' },
      { label: 'Pace', value: 'Unhurried' },
    ],
    price: { uk: 2860, in: 320000 },
    days: [
      { title: 'Arrive Colombo', place: 'Colombo', text: 'You land in the morning and are met airside. A forty-minute transfer to a restored villa in Colombo 07; the afternoon is yours, dinner on the veranda with your guide.' },
      { title: 'Colombo to Kandy', place: 'Kandy', text: 'A slow drive through spice country, arriving in the hill capital in time for the evening puja at the Temple of the Sacred Tooth Relic.' },
      { title: 'The tea line', place: 'Kandy — Ella', text: 'Reserved seats in the observation car for the seven-hour climb through tea country. Lunch at a planter’s bungalow above the tracks.' },
      { title: 'Ella, unhurried', place: 'Ella', text: 'Sunrise on Little Adam’s Peak, a working tea factory before lunch, then an empty afternoon with the veranda to yourself.' },
      { title: 'Down to the dry zone', place: 'Yala', text: 'Through the mountains to Yala. An afternoon safari with a resident naturalist, then dinner under the stars at the edge of the park.' },
      { title: 'The south coast', place: 'Galle', text: 'The coast road to Galle; sunset on the ramparts of the old fort and a table at a cinnamon-house restaurant inside the walls.' },
      { title: 'Inside the fort', place: 'Galle', text: 'A walking tour of the fort’s lanes, a private cooking lunch, and the rest of the day on the beach below the lighthouse.' },
      { title: 'Homeward', place: 'Colombo', text: 'A coastal train back to Colombo if the mood takes you, then your evening flight home. Extra nights in Mirissa are easy to add.' },
    ],
    included: [
      'Return flights from London Heathrow, taxes included',
      'Seven nights in boutique four-star hotels',
      'Private guide and driver throughout',
      'Reserved observation car, Kandy to Ella',
      'Yala safari with a resident naturalist',
      'Daily breakfast and three dinners',
      'Sri Lanka ETA, transfers and airport support',
    ],
    excluded: ['Travel insurance', 'Lunches and drinks', 'Tips and personal expenses', 'Optional extensions'],
  },
  south: {
    num: '02',
    kicker: 'Journey two · India',
    title: 'The Sacred South',
    sub: 'Six days for a long weekend: the temple at dusk, tea country in the morning, a river boat through the mangroves and the fort at golden hour. One flight, two bases, no wasted afternoons.',
    meta: [
      { label: 'Length', value: '6 days · 5 nights' },
      { label: 'Party', value: 'Private · 2–6 guests' },
      { label: 'Flights', value: 'Mumbai · Chennai · Bengaluru' },
      { label: 'Pace', value: 'Gentle' },
    ],
    price: { uk: 1390, in: 118000 },
    days: [
      { title: 'Arrive Colombo', place: 'Colombo', text: 'Fast-track on arrival and a short transfer into the city. Sundown at Galle Face with your guide and a pot of Ceylon tea.' },
      { title: 'The temple at dusk', place: 'Kandy', text: 'Up into the hills for the evening puja at the Temple of the Tooth — the quietest, most moving hour of the trip.' },
      { title: 'Tea country to the sea', place: 'Bentota', text: 'A morning among the tea terraces, a spice-garden lunch, then down through the coconut belt to Bentota and the sea.' },
      { title: 'The Madu River', place: 'Bentota', text: 'A boat through the mangroves before the heat of the day; the afternoon is for the pool, the beach or doing very little.' },
      { title: 'Galle, golden hour', place: 'Galle', text: 'The fort on foot: lighthouse, lanes, boutique workshops and a long walk along the ramparts as the light goes amber.' },
      { title: 'Homeward', place: 'Colombo', text: 'The coastal train back to Colombo, a last lunch by the water, and your evening flight home.' },
    ],
    included: [
      'Return flights from Mumbai, Chennai or Bengaluru',
      'Five nights in boutique hotels',
      'Private guide and driver throughout',
      'Temple of the Tooth puja visit',
      'Madu River boat safari',
      'Daily breakfast and three dinners',
      'Airport fast-track, ETA and transfers',
    ],
    excluded: ['Travel insurance', 'Lunches and drinks', 'Tips and personal expenses', 'Optional extensions'],
  },
};

const PLACES = [
  {
    id: 'sigiriya',
    category: 'culture' as const,
    num: '01',
    tag: 'Culture',
    title: 'Sigiriya',
    subtitle: 'Lion rock · Cultural Triangle',
    src: ASSETS.heroSigiriya,
    alt: 'Sigiriya rock fortress surrounded by jungle and morning mist',
    width: 1600,
    height: 914,
    delay: undefined,
  },
  {
    id: 'kandy',
    category: 'culture' as const,
    num: '02',
    tag: 'Culture',
    title: 'Kandy',
    subtitle: 'Hill capital · Temple of the Tooth',
    src: ASSETS.islandTemple,
    alt: 'A devotee offering lotus flowers at the lamp-lit Temple of the Sacred Tooth Relic',
    width: 1000,
    height: 1250,
    delay: '60ms',
  },
  {
    id: 'ella',
    category: 'tea' as const,
    num: '03',
    tag: 'Tea',
    title: 'Ella',
    subtitle: 'Nine arches · Hill country',
    src: ASSETS.journeyHill,
    alt: 'Tea terraces and the Nine Arch Bridge in the hills around Ella',
    width: 1600,
    height: 1067,
    delay: '120ms',
  },
  {
    id: 'yala',
    category: 'wildlife' as const,
    num: '04',
    tag: 'Wildlife',
    title: 'Yala',
    subtitle: 'Leopards & lagoons · Deep south',
    src: ASSETS.islandWildlife,
    alt: 'A herd of wild elephants crossing a shallow lagoon at dusk in Yala',
    width: 1600,
    height: 1067,
    delay: undefined,
  },
  {
    id: 'galle',
    category: 'coast' as const,
    num: '05',
    tag: 'Coast',
    title: 'Galle',
    subtitle: 'The old ramparts · South coast',
    src: ASSETS.journeyCoast,
    alt: 'Galle Fort lighthouse and ramparts at sunset',
    width: 1600,
    height: 1067,
    delay: '60ms',
  },
  {
    id: 'mirissa',
    category: 'coast' as const,
    num: '06',
    tag: 'Coast',
    title: 'Mirissa',
    subtitle: 'Whales & long beaches · South coast',
    src: ASSETS.coastMirissa,
    alt: 'Palm trees leaning over a quiet turquoise bay at Mirissa',
    width: 1600,
    height: 1067,
    delay: '120ms',
  },
];

const GALLERY_ITEMS = [
  {
    cls: 'g-item g-a',
    caption: 'Stilt fishermen at first light · Koggala',
    ariaLabel: 'Enlarge: stilt fishermen at first light, Koggala',
    src: ASSETS.coastFisher,
    alt: 'Two stilt fishermen silhouetted against an orange sunset',
    width: 1600,
    height: 914,
    num: '01',
    label: 'Stilt fishermen · Koggala',
    delay: undefined,
  },
  {
    cls: 'g-item g-b',
    caption: 'The long light at Mirissa · South coast',
    ariaLabel: 'Enlarge: the long light at Mirissa',
    src: ASSETS.coastMirissa,
    alt: 'A quiet curve of golden sand and turquoise water at Mirissa',
    width: 1600,
    height: 1067,
    num: '02',
    label: 'The long light · Mirissa',
    delay: '70ms',
  },
  {
    cls: 'g-item g-c',
    caption: 'Evening puja · Temple of the Sacred Tooth, Kandy',
    ariaLabel: 'Enlarge: evening puja at the Temple of the Sacred Tooth',
    src: ASSETS.islandTemple,
    alt: "A devotee holding lotus flowers in the warm lamplight of Kandy's temple",
    width: 1000,
    height: 1250,
    num: '03',
    label: 'Evening puja · Kandy',
    delay: undefined,
  },
  {
    cls: 'g-item g-d',
    caption: "The pluckers' hour · Nuwara Eliya tea country",
    ariaLabel: 'Enlarge: a tea plucker in the hills near Nuwara Eliya',
    src: ASSETS.islandTea,
    alt: 'A tea plucker carrying a woven basket among misty green terraces',
    width: 1000,
    height: 1250,
    num: '04',
    label: 'The pluckers’ hour · Nuwara Eliya',
    delay: '70ms',
  },
  {
    cls: 'g-item g-e',
    caption: 'Nine arches, one train · Ella',
    ariaLabel: 'Enlarge: a train crossing the Nine Arch Bridge',
    src: ASSETS.journeyHill,
    alt: 'A blue train crossing the Nine Arch Bridge above tea fields',
    width: 1600,
    height: 1067,
    num: '05',
    label: 'Nine arches · Ella',
    delay: '140ms',
  },
];

const FAQ_ITEMS = [
  {
    id: 1,
    q: 'Which journey should I choose?',
    a: 'The Hill Country Line suits first-time visitors from the UK who want tea country, wildlife and coast in one arc. The Sacred South is made for shorter breaks from India — temple culture, river country and the fort, at a gentler pace. If you are between the two, tell us your dates and we will suggest one.',
  },
  {
    id: 2,
    q: 'Do I need a visa for Sri Lanka?',
    a: 'Yes — an ETA is required for both UK and Indian passports. We file it for you as part of the booking, usually 24–48 hours before approval. You only need a passport valid for six months beyond your travel dates and a return ticket.',
  },
  {
    id: 3,
    q: 'Are the journeys private?',
    a: 'Entirely. A private guide and car travel with you throughout, and there are no fixed departures or shared coaches. Parties are two to six guests, so the itinerary moves at your pace — not a group’s.',
  },
  {
    id: 4,
    q: 'When is the best time to visit?',
    a: 'Two monsoons means somewhere is always in season. The south and west coast are best December to April; the east coast from May to September. Both journeys stay in the south, so November to April is the sweet spot.',
  },
  {
    id: 5,
    q: 'Can we change the itinerary?',
    a: 'Yes. Add a night in Mirissa, a cooking class in Galle, or a few days in the Maldives at the end. Every journey begins as a conversation and ends as a draft built around you — nothing is fixed until you say so.',
  },
  {
    id: 6,
    q: 'How do payments and cancellations work?',
    a: 'A 20% deposit confirms your dates; the balance is due 45 days before arrival. Cancel more than 60 days out and the deposit is refunded in full. We also hold a small fund for medical or family emergencies — just talk to us.',
  },
];

export default function App() {
  const [market, setMarket] = useState<MarketCode>(() => {
    try {
      const saved = localStorage.getItem('serendib-market');
      if (saved === 'uk' || saved === 'in') return saved;
    } catch {}
    return 'uk';
  });

  const [marketMenuOpen, setMarketMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeaderSolid, setIsHeaderSolid] = useState(false);
  const [activeNav, setActiveNav] = useState<string>('');
  const [toastText, setToastText] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<number | undefined>(undefined);

  // Itinerary modal
  const itineraryDialogRef = useRef<HTMLDialogElement>(null);
  const [currentJourney, setCurrentJourney] = useState<JourneyKey>('hill');

  // Lightbox modal
  const lightboxDialogRef = useRef<HTMLDialogElement>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Places filter
  const [placeFilter, setPlaceFilter] = useState<FilterCategory>('all');

  // FAQ
  const [openFaqId, setOpenFaqId] = useState<number | null>(1);

  // Enquiry Form
  const [nameVal, setNameVal] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [countryVal, setCountryVal] = useState('United Kingdom');
  const [countryTouched, setCountryTouched] = useState(false);
  const [journeyVal, setJourneyVal] = useState('');
  const [monthVal, setMonthVal] = useState('Flexible');
  const [travellersVal, setTravellersVal] = useState('2');
  const [messageVal, setMessageVal] = useState('');
  const [consentVal, setConsentVal] = useState(false);

  const [errors, setErrors] = useState<{ name?: string; email?: string; consent?: string }>({});
  const [formSent, setFormSent] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const consentInputRef = useRef<HTMLInputElement>(null);
  const enquiryPanelRef = useRef<HTMLDivElement>(null);
  const successPanelRef = useRef<HTMLDivElement>(null);
  const marketBtnRef = useRef<HTMLButtonElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('');
  const newsletterInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string) => {
    setToastText(text);
    setToastVisible(true);
    window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2800);
  };

  const handleSetMarket = (next: MarketCode, announce = true) => {
    setMarket(next);
    document.documentElement.dataset.market = next;
    if (!countryTouched) {
      setCountryVal(MARKETS[next].name);
    }
    try {
      localStorage.setItem('serendib-market', next);
    } catch {}
    if (announce) {
      showToast(`Fares now in ${MARKETS[next].code} · ${MARKETS[next].name}`);
    }
    setMarketMenuOpen(false);
    closeMobileMenu();
  };

  useEffect(() => {
    document.documentElement.dataset.market = market;
    if (!countryTouched) {
      setCountryVal(MARKETS[market].name);
    }
  }, [market, countryTouched]);

  // Header scroll listener
  useEffect(() => {
    const onScroll = () => {
      setIsHeaderSolid(window.scrollY > 56);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Click outside market menu & Escape handler
  useEffect(() => {
    const onDocClick = () => {
      if (marketMenuOpen) setMarketMenuOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMarketMenuOpen(false);
        if (mobileMenuOpen) closeMobileMenu();
      }
      if (lightboxDialogRef.current?.open) {
        if (e.key === 'ArrowLeft') {
          setGalleryIndex((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
        } else if (e.key === 'ArrowRight') {
          setGalleryIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
        }
      }
    };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [marketMenuOpen, mobileMenuOpen]);

  // Reveal on scroll & nav active state
  useEffect(() => {
    const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
    let io: IntersectionObserver | null = null;

    if ('IntersectionObserver' in window) {
      try {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io?.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
        );
        revealEls.forEach((el) => io?.observe(el));
      } catch {
        revealEls.forEach((el) => el.classList.add('is-visible'));
      }
    } else {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    const sectionIds = ['#journeys', '#island', '#gallery', '#practicalities', '#enquire'];
    const sections = sectionIds
      .map((id) => ({ id, el: document.querySelector(id) }))
      .filter((item): item is { id: string; el: Element } => Boolean(item.el));

    let navObserver: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window && sections.length) {
      navObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const match = sections.find((item) => item.el === entry.target);
            if (match) setActiveNav(match.id);
          });
        },
        { rootMargin: '-45% 0px -50% 0px' }
      );
      sections.forEach((item) => navObserver?.observe(item.el));
    }

    return () => {
      io?.disconnect();
      navObserver?.disconnect();
    };
  }, []);

  const openMobileMenu = () => {
    setMobileMenuOpen(true);
    document.body.classList.add('menu-open');
    setMarketMenuOpen(false);
  };

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    document.body.classList.remove('menu-open');
  }

  const openItinerary = (key: JourneyKey) => {
    setCurrentJourney(key);
    const dlg = itineraryDialogRef.current;
    if (dlg && !dlg.open) {
      dlg.showModal();
      document.body.classList.add('modal-open');
      dlg.scrollTop = 0;
    }
    setMarketMenuOpen(false);
    closeMobileMenu();
  };

  const closeItinerary = () => {
    const dlg = itineraryDialogRef.current;
    if (dlg && dlg.open) {
      dlg.close();
    }
    document.body.classList.remove('modal-open');
  };

  const openLightbox = (index: number) => {
    setGalleryIndex((index + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
    const dlg = lightboxDialogRef.current;
    if (dlg && !dlg.open) {
      dlg.showModal();
      document.body.classList.add('modal-open');
    }
  };

  const closeLightbox = () => {
    const dlg = lightboxDialogRef.current;
    if (dlg && dlg.open) {
      dlg.close();
    }
    document.body.classList.remove('modal-open');
  };

  const resetEnquiry = () => {
    setNameVal('');
    setEmailVal('');
    setCountryTouched(false);
    setCountryVal(MARKETS[market].name);
    setJourneyVal('');
    setMonthVal('Flexible');
    setTravellersVal('2');
    setMessageVal('');
    setConsentVal(false);
    setErrors({});
    setFormSent(false);
  };

  const startEnquiry = (journeyKey: JourneyKey) => {
    if (formSent) resetEnquiry();
    setJourneyVal(journeyKey);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = document.getElementById('enquire');
    if (target) {
      target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    }
    window.setTimeout(
      () => {
        nameInputRef.current?.focus({ preventScroll: true });
      },
      prefersReduced ? 50 : 650
    );
  };

  const validateForm = () => {
    const nextErrors: { name?: string; email?: string; consent?: string } = {};
    if (!nameVal.trim()) {
      nextErrors.name = 'This field is required.';
    }
    const trimmedEmail = emailVal.trim();
    if (!trimmedEmail) {
      nextErrors.email = 'Please add your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail)) {
      nextErrors.email = 'Please check the email address.';
    }
    if (!consentVal) {
      nextErrors.consent = 'Please confirm we may contact you.';
    }
    setErrors(nextErrors);
    return nextErrors;
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateForm();
    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name) nameInputRef.current?.focus();
      else if (nextErrors.email) emailInputRef.current?.focus();
      else if (nextErrors.consent) consentInputRef.current?.focus();
      return;
    }
    setFormSent(true);
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(() => {
      successPanelRef.current?.focus({ preventScroll: true });
      enquiryPanelRef.current?.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'center',
      });
    }, 20);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      setNewsletterStatus('Please enter a valid email address.');
      newsletterInputRef.current?.focus();
      return;
    }
    setNewsletterStatus('Thank you — the next dispatch is on its way.');
    setNewsletterEmail('');
  };

  const visiblePlaces = PLACES.filter(
    (place) => placeFilter === 'all' || place.category === placeFilter
  );

  const activeJourneyData = JOURNEYS[currentJourney];
  const currentGalleryItem = GALLERY_ITEMS[galleryIndex] || GALLERY_ITEMS[0];

  return (
    <>
      <a className="skip-link" href="#journeys">
        Skip to the journeys
      </a>

      <header className={`site-header${isHeaderSolid ? ' is-solid' : ''}`} id="site-header">
        <div className="container header-inner">
          <a className="brand" href="#top" aria-label="Serendib — back to top">
            <span className="brand-name">Serendib</span>
            <span className="brand-sub">Ceylon · Est. 2009</span>
          </a>

          <nav className="primary-nav" aria-label="Primary">
            <a href="#journeys" className={activeNav === '#journeys' ? 'is-active' : ''}>
              Journeys
            </a>
            <a href="#island" className={activeNav === '#island' ? 'is-active' : ''}>
              The Island
            </a>
            <a href="#gallery" className={activeNav === '#gallery' ? 'is-active' : ''}>
              Gallery
            </a>
            <a href="#practicalities" className={activeNav === '#practicalities' ? 'is-active' : ''}>
              Practicalities
            </a>
            <a href="#enquire" className={activeNav === '#enquire' ? 'is-active' : ''}>
              Enquire
            </a>
          </nav>

          <div className="header-actions">
            <div className="market" onClick={(e) => e.stopPropagation()}>
              <button
                ref={marketBtnRef}
                className="market-btn"
                type="button"
                aria-haspopup="menu"
                aria-expanded={marketMenuOpen}
                aria-controls="market-menu"
                onClick={() => setMarketMenuOpen((prev) => !prev)}
              >
                <span className="market-caption">From</span>
                <span className="market-name">{MARKETS[market].name}</span>
                <svg className="chev" viewBox="0 0 12 8" aria-hidden="true" focusable="false">
                  <path d="M1 1.5 6 6.5l5-5" fill="none" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              </button>
              <div
                className="market-menu"
                id="market-menu"
                role="menu"
                aria-label="Travelling from"
                hidden={!marketMenuOpen}
              >
                <p className="market-menu-title">Travelling from</p>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={market === 'uk'}
                  onClick={() => handleSetMarket('uk', true)}
                >
                  <span>United Kingdom</span>
                  <span className="market-cur">£ GBP</span>
                </button>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={market === 'in'}
                  onClick={() => handleSetMarket('in', true)}
                >
                  <span>India</span>
                  <span className="market-cur">₹ INR</span>
                </button>
                <p className="market-menu-note">Fares, flights and entry notes follow your market.</p>
              </div>
            </div>
            <a className="btn btn-ghost header-cta" href="#enquire">
              Plan a journey
            </a>
            <button
              ref={menuToggleRef}
              className="menu-toggle"
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => (mobileMenuOpen ? closeMobileMenu() : openMobileMenu())}
            >
              <span className="menu-toggle-label">{mobileMenuOpen ? 'Close' : 'Menu'}</span>
              <span className="menu-toggle-bars" aria-hidden="true">
                <i></i>
                <i></i>
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="mobile-menu" id="mobile-menu" hidden={!mobileMenuOpen}>
        <div className="mobile-menu-inner">
          <p className="mobile-menu-eyebrow">Serendib · Menu</p>
          <nav aria-label="Mobile">
            <a href="#journeys" onClick={closeMobileMenu}>
              <span>01</span>Journeys
            </a>
            <a href="#island" onClick={closeMobileMenu}>
              <span>02</span>The Island
            </a>
            <a href="#gallery" onClick={closeMobileMenu}>
              <span>03</span>Gallery
            </a>
            <a href="#practicalities" onClick={closeMobileMenu}>
              <span>04</span>Practicalities
            </a>
            <a href="#enquire" onClick={closeMobileMenu}>
              <span>05</span>Enquire
            </a>
          </nav>
          <div className="mobile-market">
            <p>Travelling from</p>
            <div className="mobile-market-btns">
              <button
                type="button"
                aria-pressed={market === 'uk'}
                onClick={() => handleSetMarket('uk', true)}
              >
                United Kingdom <span>£</span>
              </button>
              <button
                type="button"
                aria-pressed={market === 'in'}
                onClick={() => handleSetMarket('in', true)}
              >
                India <span>₹</span>
              </button>
            </div>
          </div>
          <a className="mobile-contact" href="mailto:hello@serendib.travel">
            hello@serendib.travel
          </a>
        </div>
      </div>

      <main id="top">
        {/* Hero */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-media">
            <img
              src={ASSETS.heroSigiriya}
              alt="Sigiriya rock fortress rising above mist-covered jungle at dawn"
              width="1600"
              height="914"
              fetchPriority="high"
            />
          </div>
          <div className="hero-veil" aria-hidden="true"></div>

          <div className="container hero-content">
            <p className="hero-kicker">
              <span className="hairline" aria-hidden="true"></span>Guided journeys · Sri Lanka
            </p>
            <h1 id="hero-title">
              An island that keeps
              <br />
              its own <em>time.</em>
            </h1>
            <p className="hero-lede">
              Two considered journeys through Ceylon’s hill country, ancient cities and southern coast — shaped around where you’re travelling from.
            </p>
            <div className="hero-actions">
              <a className="hero-link" href="#journeys">
                <span>Explore the two journeys</span>
                <span className="hero-link-icon" aria-hidden="true">
                  <svg viewBox="0 0 16 16" focusable="false">
                    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </span>
              </a>
              <a className="hero-link hero-link-soft" href="#enquire">
                Speak to a guide
              </a>
            </div>
          </div>

          <p className="hero-coords" aria-hidden="true">
            6°55′ N — 79°50′ E · Colombo
          </p>

          <div className="hero-foot">
            <div className="container hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-label">Signature journeys</span>
                <span className="hero-stat-value">Two</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-label">Length</span>
                <span className="hero-stat-value">6 – 8 days</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-label">Local guides</span>
                <span className="hero-stat-value">Twenty-four</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-label">Guest rating</span>
                <span className="hero-stat-value">
                  4.9 <span>/ 5 · 312 reviews</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Marquee */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            <span>Sigiriya</span>
            <i>·</i>
            <span>Kandy</span>
            <i>·</i>
            <span>Nine Arch Bridge</span>
            <i>·</i>
            <span>Yala</span>
            <i>·</i>
            <span>Galle Fort</span>
            <i>·</i>
            <span>Mirissa</span>
            <i>·</i>
            <span>Nuwara Eliya</span>
            <i>·</i>
            <span>Anuradhapura</span>
            <i>·</i>
            <span>Trincomalee</span>
            <i>·</i>
            <span>Jaffna</span>
            <i>·</i>
            <span>Sigiriya</span>
            <i>·</i>
            <span>Kandy</span>
            <i>·</i>
            <span>Nine Arch Bridge</span>
            <i>·</i>
            <span>Yala</span>
            <i>·</i>
            <span>Galle Fort</span>
            <i>·</i>
            <span>Mirissa</span>
            <i>·</i>
            <span>Nuwara Eliya</span>
            <i>·</i>
            <span>Anuradhapura</span>
            <i>·</i>
            <span>Trincomalee</span>
            <i>·</i>
            <span>Jaffna</span>
            <i>·</i>
          </div>
        </div>

        {/* Manifesto */}
        <section className="section manifesto">
          <div className="container manifesto-grid">
            <p className="eyebrow section-label" data-reveal>
              <span className="num">01</span>The idea
            </p>
            <div>
              <h2 className="display" data-reveal>
                We plan less,
                <br />
                so you notice <em>more.</em>
              </h2>
              <div className="manifesto-cols">
                <p data-reveal>
                  Serendib is a small travel studio in Colombo. For fifteen years we have designed private journeys for travellers from the United Kingdom and India — eight days in the tea country, six on the southern coast — with the same handful of guides, drivers and bungalow keepers.
                </p>
                <p data-reveal>
                  We keep parties at two to six, book the seat with the window, and leave the afternoons empty. The result feels less like a tour and more like being shown around by a friend who happens to live there.
                </p>
              </div>
              <div className="principles">
                <div className="principle" data-reveal>
                  <span className="principle-num">01</span>
                  <h3>Less road, more place</h3>
                  <p>Three bases, not seven. We would rather you stay for the second cup of tea.</p>
                </div>
                <div className="principle" data-reveal>
                  <span className="principle-num">02</span>
                  <h3>Local by default</h3>
                  <p>Guides, drivers, cooks and bungalows — all Sri Lankan, all paid fairly.</p>
                </div>
                <div className="principle" data-reveal>
                  <span className="principle-num">03</span>
                  <h3>Small by choice</h3>
                  <p>Two to six guests. No coaches, no fixed departures, no queues.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journeys */}
        <section className="section journeys" id="journeys">
          <div className="container">
            <header className="section-head">
              <div>
                <p className="eyebrow" data-reveal>
                  <span className="num">02</span>The journeys
                </p>
                <h2 className="display" data-reveal>
                  Two ways into <em>Ceylon.</em>
                </h2>
              </div>
              <div className="fare-note" data-reveal>
                <span>Fares shown for travellers from</span>
                <strong>{MARKETS[market].name}</strong>
                <span className="fare-sub">
                  in <span>{MARKETS[market].code}</span> ·{' '}
                  <button
                    className="link-underline"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setMarketMenuOpen(true);
                      marketBtnRef.current?.focus({ preventScroll: true });
                    }}
                  >
                    Change
                  </button>
                </span>
              </div>
            </header>

            <div className="journey-grid">
              {/* Journey 01 */}
              <article className="journey-card" data-reveal>
                <button
                  className="journey-media"
                  type="button"
                  onClick={() => openItinerary('hill')}
                  aria-label="View the day-by-day itinerary for The Hill Country Line"
                >
                  <img
                    src={ASSETS.journeyHill}
                    alt="A blue train crossing the Nine Arch Bridge through tea-covered hills in Ella"
                    width="1600"
                    height="1067"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="media-index">01</span>
                  <span className="media-badge">Designed for UK travellers</span>
                </button>
                <div className="journey-body">
                  <div className="journey-top">
                    <h3>The Hill Country Line</h3>
                    <div className="price-block">
                      <span className="price-label">From</span>
                      <span className="price">{formatMoney(JOURNEYS.hill.price[market], market)}</span>
                      <span className="price-unit">per person</span>
                    </div>
                  </div>
                  <p className="journey-route">
                    Colombo <i>·</i> Kandy <i>·</i> Ella <i>·</i> Yala <i>·</i> Galle
                  </p>
                  <p className="journey-desc">
                    The classic arc: the hill capital, the tea line to Ella, a safari in Yala and three slow nights inside the Galle Fort. Built for the long-haul flight from London — you land, exhale, and the island does the rest.
                  </p>
                  <dl className="journey-facts">
                    <div className="fact">
                      <dt>Duration</dt>
                      <dd>8 days · 7 nights</dd>
                    </div>
                    <div className="fact">
                      <dt>Party</dt>
                      <dd>Private · 2–6 guests</dd>
                    </div>
                    <div className="fact">
                      <dt>Flights</dt>
                      <dd>Direct from London Heathrow</dd>
                    </div>
                    <div className="fact">
                      <dt>Pace</dt>
                      <dd>Unhurried · three bases</dd>
                    </div>
                  </dl>
                  <ul className="include-list">
                    <li>Reserved observation car, Kandy to Ella</li>
                    <li>Yala safari with a resident naturalist</li>
                    <li>Four-star tea bungalows and fort hotels</li>
                    <li>Return flights from Heathrow, taxes included</li>
                  </ul>
                  <div className="journey-actions">
                    <button className="btn btn-solid" type="button" onClick={() => openItinerary('hill')}>
                      View itinerary
                    </button>
                    <button className="link-arrow" type="button" onClick={() => startEnquiry('hill')}>
                      Enquire{' '}
                      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                        <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>

              {/* Journey 02 */}
              <article
                className="journey-card"
                data-reveal
                style={{ '--reveal-delay': '90ms' } as React.CSSProperties}
              >
                <button
                  className="journey-media"
                  type="button"
                  onClick={() => openItinerary('south')}
                  aria-label="View the day-by-day itinerary for The Sacred South"
                >
                  <img
                    src={ASSETS.journeyCoast}
                    alt="The white lighthouse and ramparts of Galle Fort at golden hour"
                    width="1600"
                    height="1067"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="media-index">02</span>
                  <span className="media-badge">Designed for Indian travellers</span>
                </button>
                <div className="journey-body">
                  <div className="journey-top">
                    <h3>The Sacred South</h3>
                    <div className="price-block">
                      <span className="price-label">From</span>
                      <span className="price">{formatMoney(JOURNEYS.south.price[market], market)}</span>
                      <span className="price-unit">per person</span>
                    </div>
                  </div>
                  <p className="journey-route">
                    Colombo <i>·</i> Kandy <i>·</i> Bentota <i>·</i> Galle
                  </p>
                  <p className="journey-desc">
                    A shorter, softer loop made for a long weekend from India: the Temple of the Tooth at dusk, tea gardens in the morning, a river boat through the mangroves, and the ramparts of Galle at golden hour.
                  </p>
                  <dl className="journey-facts">
                    <div className="fact">
                      <dt>Duration</dt>
                      <dd>6 days · 5 nights</dd>
                    </div>
                    <div className="fact">
                      <dt>Party</dt>
                      <dd>Private · 2–6 guests</dd>
                    </div>
                    <div className="fact">
                      <dt>Flights</dt>
                      <dd>Direct from Mumbai / Chennai</dd>
                    </div>
                    <div className="fact">
                      <dt>Pace</dt>
                      <dd>Gentle · two bases</dd>
                    </div>
                  </dl>
                  <ul className="include-list">
                    <li>Direct flights, Mumbai · Chennai · Bengaluru</li>
                    <li>Evening puja at the Temple of the Tooth</li>
                    <li>Madu River boat safari and tea estate lunch</li>
                    <li>Five nights, breakfasts and three dinners</li>
                  </ul>
                  <div className="journey-actions">
                    <button className="btn btn-solid" type="button" onClick={() => openItinerary('south')}>
                      View itinerary
                    </button>
                    <button className="link-arrow" type="button" onClick={() => startEnquiry('south')}>
                      Enquire{' '}
                      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                        <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* Compare */}
        <section className="section compare">
          <div className="container">
            <header className="section-head">
              <div>
                <p className="eyebrow" data-reveal>
                  <span className="num">03</span>Compare
                </p>
                <h2 className="display" data-reveal>
                  Two ways to see <em>the island.</em>
                </h2>
              </div>
              <p className="section-note" data-reveal>
                Every journey is private, guided and built around your dates. The difference is rhythm.
              </p>
            </header>

            <div className="compare-wrap" data-reveal>
              <table className="compare-table">
                <caption className="visually-hidden">
                  Comparison of The Hill Country Line and The Sacred South
                </caption>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className="visually-hidden">Feature</span>
                    </th>
                    <th scope="col" className="compare-col">
                      <h3>The Hill Country Line</h3>
                      <span className="compare-tag">For UK travellers · 8 days</span>
                    </th>
                    <th scope="col" className="compare-col">
                      <h3>The Sacred South</h3>
                      <span className="compare-tag">For Indian travellers · 6 days</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Route</th>
                    <td>Colombo · Kandy · Ella · Yala · Galle</td>
                    <td>Colombo · Kandy · Bentota · Galle</td>
                  </tr>
                  <tr>
                    <th scope="row">Pace</th>
                    <td>Unhurried — three bases</td>
                    <td>Gentle — two bases</td>
                  </tr>
                  <tr>
                    <th scope="row">Flights</th>
                    <td>Direct from London Heathrow, overnight</td>
                    <td>Direct from Mumbai, Chennai or Bengaluru</td>
                  </tr>
                  <tr>
                    <th scope="row">Signature moment</th>
                    <td>Observation car over the Nine Arch Bridge</td>
                    <td>Evening puja at the Temple of the Tooth</td>
                  </tr>
                  <tr>
                    <th scope="row">Best months</th>
                    <td>December – April</td>
                    <td>November – April</td>
                  </tr>
                  <tr className="price-row">
                    <th scope="row">From</th>
                    <td>
                      <span>{formatMoney(JOURNEYS.hill.price[market], market)}</span> <small>per person</small>
                    </td>
                    <td>
                      <span>{formatMoney(JOURNEYS.south.price[market], market)}</span> <small>per person</small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="compare-hint" aria-hidden="true">
              Swipe the table to compare both journeys <span>&rarr;</span>
            </p>
            <p className="compare-note" data-reveal>
              Prices include return flights, taxes, private guiding, transfers and the experiences listed in each itinerary.
            </p>
          </div>
        </section>

        {/* Island */}
        <section className="section island" id="island">
          <div className="container">
            <header className="section-head island-head">
              <div>
                <p className="eyebrow" data-reveal>
                  <span className="num">04</span>The island
                </p>
                <h2 className="display" data-reveal>
                  Places we return <em>to.</em>
                </h2>
              </div>
              <div className="island-tools" data-reveal>
                <div className="filters" role="group" aria-label="Filter places by kind">
                  {(
                    [
                      ['all', 'All'],
                      ['culture', 'Culture'],
                      ['coast', 'Coast'],
                      ['wildlife', 'Wildlife'],
                      ['tea', 'Tea'],
                    ] as const
                  ).map(([cat, label]) => (
                    <button
                      key={cat}
                      className="filter-btn"
                      type="button"
                      aria-pressed={placeFilter === cat}
                      onClick={() => setPlaceFilter(cat)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="filter-count">
                  <span id="place-count">{visiblePlaces.length}</span> places ·{' '}
                  <span className="visually-hidden">Use the filters to narrow the list</span>
                </p>
              </div>
            </header>

            <div className="place-grid" id="place-grid">
              {PLACES.map((place) => {
                const show = placeFilter === 'all' || place.category === placeFilter;
                return (
                  <figure
                    key={place.id}
                    className="place"
                    data-category={place.category}
                    data-reveal
                    hidden={!show}
                    style={
                      place.delay
                        ? ({ '--reveal-delay': place.delay } as React.CSSProperties)
                        : undefined
                    }
                  >
                    <img
                      src={place.src}
                      alt={place.alt}
                      width={place.width}
                      height={place.height}
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="place-shade" aria-hidden="true"></span>
                    <span className="place-tag">{place.tag}</span>
                    <span className="place-num">{place.num}</span>
                    <figcaption className="place-caption">
                      <h3>{place.title}</h3>
                      <p>{place.subtitle}</p>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="section gallery" id="gallery">
          <div className="container">
            <header className="section-head">
              <div>
                <p className="eyebrow" data-reveal>
                  <span className="num">05</span>The gallery
                </p>
                <h2 className="display" data-reveal>
                  The island, <em>between frames.</em>
                </h2>
              </div>
              <p className="section-note" data-reveal>
                Recent journeys, unretouched. Click any frame to look closer.
              </p>
            </header>

            <div className="gallery-grid">
              {GALLERY_ITEMS.map((item, idx) => (
                <button
                  key={item.num}
                  className={item.cls}
                  type="button"
                  data-caption={item.caption}
                  aria-label={item.ariaLabel}
                  data-reveal
                  style={
                    item.delay
                      ? ({ '--reveal-delay': item.delay } as React.CSSProperties)
                      : undefined
                  }
                  onClick={() => openLightbox(idx)}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="g-label">
                    <span>{item.num}</span>
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="section testimonials">
          <div className="container">
            <header className="section-head">
              <div>
                <p className="eyebrow" data-reveal>
                  <span className="num">06</span>In their words
                </p>
                <h2 className="display" data-reveal>
                  Notes from <em>the road.</em>
                </h2>
              </div>
              <p className="section-note rating-note" data-reveal>
                <span className="stars" aria-hidden="true">
                  ★★★★★
                </span>
                4.9 / 5 · 312 guest reviews
              </p>
            </header>

            <div className="quote-grid">
              <figure className="quote" data-reveal>
                <span className="stars" aria-hidden="true">
                  ★★★★★
                </span>
                <blockquote>
                  “We have travelled a fair amount, and I have never had an itinerary read the room so well. The tea bungalow in Ella was the quietest place I have ever slept.”
                </blockquote>
                <figcaption>
                  <strong>Eleanor &amp; James Whitfield</strong>
                  <span>London · The Hill Country Line</span>
                </figcaption>
              </figure>
              <figure
                className="quote"
                data-reveal
                style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
              >
                <span className="stars" aria-hidden="true">
                  ★★★★★
                </span>
                <blockquote>
                  “Six days, no rushing, and a guide who knew every lane in Galle. My parents came too — it worked for all three of us.”
                </blockquote>
                <figcaption>
                  <strong>Priya Nair</strong>
                  <span>Mumbai · The Sacred South</span>
                </figcaption>
              </figure>
              <figure
                className="quote"
                data-reveal
                style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
              >
                <span className="stars" aria-hidden="true">
                  ★★★★★
                </span>
                <blockquote>
                  “The puja at dusk in Kandy was the moment the trip turned from a holiday into a memory. Faultless planning from the first email.”
                </blockquote>
                <figcaption>
                  <strong>Rohan Mehta</strong>
                  <span>Bengaluru · The Sacred South</span>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* Practicalities */}
        <section className="section practicalities" id="practicalities">
          <div className="container">
            <header className="section-head">
              <div>
                <p className="eyebrow" data-reveal>
                  <span className="num">07</span>Practicalities
                </p>
                <h2 className="display" data-reveal>
                  Before you <em>go.</em>
                </h2>
              </div>
              <p className="section-note" data-reveal>
                The small print, in plain language. We handle most of it once your dates are set.
              </p>
            </header>

            <div className="prac-grid">
              <div className="prac" data-reveal>
                <span className="prac-num">01</span>
                <h3>Arriving</h3>
                <p>
                  {market === 'uk' ? (
                    <span>
                      Overnight direct from London Heathrow with SriLankan Airlines or British Airways — 10h 45m, landing in the morning.
                    </span>
                  ) : (
                    <span>
                      Direct from Mumbai, Chennai or Bengaluru — under two hours from Chennai, landing in time for lunch.
                    </span>
                  )}{' '}
                  A private transfer to your first hotel is included.
                </p>
              </div>
              <div
                className="prac"
                data-reveal
                style={{ '--reveal-delay': '60ms' } as React.CSSProperties}
              >
                <span className="prac-num">02</span>
                <h3>Entry &amp; visas</h3>
                <p>
                  UK and Indian passports both need a Sri Lanka ETA. We file it for you once dates are confirmed; approval usually takes 24–48 hours. Passports should be valid six months beyond travel.
                </p>
              </div>
              <div
                className="prac"
                data-reveal
                style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
              >
                <span className="prac-num">03</span>
                <h3>Money &amp; manners</h3>
                <p>
                  The rupee (LKR) is local; cards work in the cities, cash in the hills. Cover shoulders and knees at temples, remove shoes and hats, and never pose with your back to a Buddha image.
                </p>
              </div>
              <div
                className="prac"
                data-reveal
                style={{ '--reveal-delay': '180ms' } as React.CSSProperties}
              >
                <span className="prac-num">04</span>
                <h3>Weather &amp; seasons</h3>
                <p>
                  Two monsoons, two coasts: the south and west shine December to April, the east from May to September. Every journey here is planned around the right coast.
                </p>
              </div>
            </div>

            <div className="season" data-reveal>
              <div className="season-head">
                <h3>When the island is at its best</h3>
                <div className="season-legend">
                  <span>
                    <i className="swatch is-in"></i>In season
                  </span>
                  <span>
                    <i className="swatch is-sh"></i>Shoulder
                  </span>
                </div>
              </div>
              <div className="season-scroll">
                <p className="visually-hidden">
                  South and west coast: in season December to April; shoulder October and November. East coast: in season May to September; shoulder January, April and October.
                </p>
                <div className="season-grid" aria-hidden="true">
                  <span className="season-blank" aria-hidden="true"></span>
                  <span className="month">Jan</span>
                  <span className="month">Feb</span>
                  <span className="month">Mar</span>
                  <span className="month">Apr</span>
                  <span className="month">May</span>
                  <span className="month">Jun</span>
                  <span className="month">Jul</span>
                  <span className="month">Aug</span>
                  <span className="month">Sep</span>
                  <span className="month">Oct</span>
                  <span className="month">Nov</span>
                  <span className="month">Dec</span>

                  <span className="row-label">South &amp; west</span>
                  <i className="cell is-in" role="cell" aria-label="January, in season"></i>
                  <i className="cell is-in" role="cell" aria-label="February, in season"></i>
                  <i className="cell is-in" role="cell" aria-label="March, in season"></i>
                  <i className="cell is-in" role="cell" aria-label="April, in season"></i>
                  <i className="cell" role="cell" aria-label="May, low season"></i>
                  <i className="cell" role="cell" aria-label="June, low season"></i>
                  <i className="cell" role="cell" aria-label="July, low season"></i>
                  <i className="cell" role="cell" aria-label="August, low season"></i>
                  <i className="cell" role="cell" aria-label="September, low season"></i>
                  <i className="cell is-sh" role="cell" aria-label="October, shoulder season"></i>
                  <i className="cell is-sh" role="cell" aria-label="November, shoulder season"></i>
                  <i className="cell is-in" role="cell" aria-label="December, in season"></i>

                  <span className="row-label">East coast</span>
                  <i className="cell is-sh" role="cell" aria-label="January, shoulder season"></i>
                  <i className="cell" role="cell" aria-label="February, low season"></i>
                  <i className="cell" role="cell" aria-label="March, low season"></i>
                  <i className="cell is-sh" role="cell" aria-label="April, shoulder season"></i>
                  <i className="cell is-in" role="cell" aria-label="May, in season"></i>
                  <i className="cell is-in" role="cell" aria-label="June, in season"></i>
                  <i className="cell is-in" role="cell" aria-label="July, in season"></i>
                  <i className="cell is-in" role="cell" aria-label="August, in season"></i>
                  <i className="cell is-in" role="cell" aria-label="September, in season"></i>
                  <i className="cell is-sh" role="cell" aria-label="October, shoulder season"></i>
                  <i className="cell" role="cell" aria-label="November, low season"></i>
                  <i className="cell" role="cell" aria-label="December, low season"></i>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section faq">
          <div className="container faq-grid">
            <div className="faq-intro">
              <p className="eyebrow" data-reveal>
                <span className="num">08</span>Questions
              </p>
              <h2 className="display" data-reveal>
                Things people <em>ask.</em>
              </h2>
              <p className="faq-lede" data-reveal>
                Still deciding? Write to a guide — a real person in Colombo, not a bot. We answer within one working day.
              </p>
              <a className="link-arrow" href="#enquire" data-reveal>
                Ask a question{' '}
                <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                  <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </a>
            </div>

            <div className="faq-list" data-reveal>
              {FAQ_ITEMS.map((item) => {
                const isOpen = openFaqId === item.id;
                return (
                  <article key={item.id} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                    <h3>
                      <button
                        className="faq-q"
                        type="button"
                        id={`faq-btn-${item.id}`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-${item.id}`}
                        onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                      >
                        <span>{item.q}</span>
                        <i className="faq-icon" aria-hidden="true"></i>
                      </button>
                    </h3>
                    <div
                      className="faq-a"
                      id={`faq-${item.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${item.id}`}
                    >
                      <div className="faq-a-inner">
                        <p>{item.a}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Enquiry */}
        <section className="section enquiry" id="enquire">
          <div className="container enquiry-grid">
            <div className="enquiry-intro">
              <p className="eyebrow" data-reveal>
                <span className="num">09</span>Enquire
              </p>
              <h2 className="display" data-reveal>
                Begin with a <em>conversation.</em>
              </h2>
              <p className="enquiry-lede" data-reveal>
                Tell us roughly when, who and how long. A guide from our Colombo studio will reply with a draft itinerary and a firm price — no deposits, no pressure.
              </p>

              <dl className="contact-block" data-reveal>
                <div className="contact-item">
                  <dt>Studio</dt>
                  <dd>
                    41 Rosmead Place
                    <br />
                    Colombo 07, Sri Lanka
                  </dd>
                </div>
                <div className="contact-item">
                  <dt>Write</dt>
                  <dd>
                    <a href="mailto:hello@serendib.travel">hello@serendib.travel</a>
                  </dd>
                </div>
                <div className="contact-item">
                  <dt>Call</dt>
                  <dd>
                    <a href="tel:+94112694410">+94 11 269 4410</a>
                  </dd>
                </div>
                <div className="contact-item">
                  <dt>Hours</dt>
                  <dd>Monday – Saturday · 09:00–18:00 IST</dd>
                </div>
              </dl>
            </div>

            <div
              ref={enquiryPanelRef}
              className={`enquiry-panel${formSent ? ' is-sent' : ''}`}
              id="enquiry-panel"
            >
              <form
                className="enquiry-form"
                id="enquiry-form"
                noValidate
                onSubmit={handleEnquirySubmit}
              >
                <div className="form-row">
                  <div className={`field${errors.name ? ' is-invalid' : ''}`}>
                    <label htmlFor="name">Your name</label>
                    <input
                      ref={nameInputRef}
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={nameVal}
                      aria-invalid={errors.name ? 'true' : undefined}
                      onChange={(e) => {
                        setNameVal(e.target.value);
                        if (errors.name && e.target.value.trim()) {
                          setErrors((prev) => ({ ...prev, name: undefined }));
                        }
                      }}
                    />
                    <p className="field-error" role="alert">
                      {errors.name || ''}
                    </p>
                  </div>
                  <div className={`field${errors.email ? ' is-invalid' : ''}`}>
                    <label htmlFor="email">Email</label>
                    <input
                      ref={emailInputRef}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={emailVal}
                      aria-invalid={errors.email ? 'true' : undefined}
                      onChange={(e) => {
                        setEmailVal(e.target.value);
                        if (errors.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.target.value.trim())) {
                          setErrors((prev) => ({ ...prev, email: undefined }));
                        }
                      }}
                    />
                    <p className="field-error" role="alert">
                      {errors.email || ''}
                    </p>
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="from-country">Travelling from</label>
                    <select
                      id="from-country"
                      name="country"
                      value={countryVal}
                      onChange={(e) => {
                        setCountryTouched(true);
                        setCountryVal(e.target.value);
                      }}
                    >
                      <option>United Kingdom</option>
                      <option>India</option>
                      <option>Elsewhere</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="journey-select">Journey of interest</label>
                    <select
                      id="journey-select"
                      name="journey"
                      value={journeyVal}
                      onChange={(e) => setJourneyVal(e.target.value)}
                    >
                      <option value="">Not sure yet</option>
                      <option value="hill">The Hill Country Line — 8 days</option>
                      <option value="south">The Sacred South — 6 days</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="field">
                    <label htmlFor="month">Preferred month</label>
                    <select
                      id="month"
                      name="month"
                      value={monthVal}
                      onChange={(e) => setMonthVal(e.target.value)}
                    >
                      <option>Flexible</option>
                      <option>January</option>
                      <option>February</option>
                      <option>March</option>
                      <option>April</option>
                      <option>May</option>
                      <option>June</option>
                      <option>July</option>
                      <option>August</option>
                      <option>September</option>
                      <option>October</option>
                      <option>November</option>
                      <option>December</option>
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="travellers">Travellers</label>
                    <select
                      id="travellers"
                      name="travellers"
                      value={travellersVal}
                      onChange={(e) => setTravellersVal(e.target.value)}
                    >
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      <option>6</option>
                      <option>7+</option>
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="message">Anything else</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Dates, pace, who’s coming — the more we know, the better the first draft."
                    value={messageVal}
                    onChange={(e) => setMessageVal(e.target.value)}
                  ></textarea>
                </div>

                <div className={`check-field${errors.consent ? ' is-invalid' : ''}`}>
                  <label className="check">
                    <input
                      ref={consentInputRef}
                      type="checkbox"
                      id="consent"
                      name="consent"
                      required
                      checked={consentVal}
                      aria-invalid={errors.consent ? 'true' : undefined}
                      onChange={(e) => {
                        setConsentVal(e.target.checked);
                        if (errors.consent && e.target.checked) {
                          setErrors((prev) => ({ ...prev, consent: undefined }));
                        }
                      }}
                    />
                    <span>I’m happy to be contacted about this enquiry.</span>
                  </label>
                  <p className="field-error" role="alert">
                    {errors.consent || ''}
                  </p>
                </div>

                <div className="form-submit">
                  <p className="form-note">Design prototype — enquiries are not delivered.</p>
                  <button className="btn btn-gold" type="submit">
                    Send enquiry{' '}
                    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                  </button>
                </div>
              </form>

              <div ref={successPanelRef} className="form-success" tabIndex={-1} aria-live="polite">
                <p className="eyebrow">
                  <span className="num">✓</span>Received
                </p>
                <h3>Thank you — your note is with our Colombo desk.</h3>
                <p>
                  A guide will reply within one working day with a draft itinerary and a firm price. If your dates are close, call{' '}
                  <a href="tel:+94112694410">+94 11 269 4410</a> and ask for the journeys team.
                </p>
                <p className="form-note">Demo interface — no message has actually been sent.</p>
                <button className="btn btn-ghost" type="button" id="reset-enquiry" onClick={resetEnquiry}>
                  Send another enquiry
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="footer-wordmark">
            <span>Serendib</span>
            <small>Journeys through Ceylon</small>
          </div>

          <div className="footer-grid">
            <div className="footer-col">
              <h4>Explore</h4>
              <a href="#journeys">The journeys</a>
              <a href="#island">The island</a>
              <a href="#gallery">Gallery</a>
              <a href="#practicalities">Practicalities</a>
            </div>
            <div className="footer-col">
              <h4>Two journeys</h4>
              <a href="#journeys">The Hill Country Line</a>
              <a href="#journeys">The Sacred South</a>
              <a href="#enquire">Plan something else</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <p>
                41 Rosmead Place
                <br />
                Colombo 07, Sri Lanka
              </p>
              <a href="mailto:hello@serendib.travel">hello@serendib.travel</a>
              <a href="tel:+94112694410">+94 11 269 4410</a>
            </div>
            <div className="footer-col footer-news">
              <h4>The Serendib Letter</h4>
              <p>Four dispatches a year from the island. No noise, no offers.</p>
              <form id="newsletter-form" noValidate onSubmit={handleNewsletterSubmit}>
                <label className="visually-hidden" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  ref={newsletterInputRef}
                  id="newsletter-email"
                  type="email"
                  placeholder="Your email"
                  autoComplete="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
                <button type="submit" aria-label="Subscribe to the Serendib Letter">
                  <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
                    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                </button>
              </form>
              <p className="newsletter-status" id="newsletter-status" role="status">
                {newsletterStatus}
              </p>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Serendib Journeys · Design prototype, sample content</span>
            <span>
              Fares in <span>{MARKETS[market].code}</span> ·{' '}
              <button
                className="link-underline footer-market"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMarketMenuOpen(true);
                  marketBtnRef.current?.focus({ preventScroll: true });
                }}
              >
                Travelling from <span>{MARKETS[market].name}</span>
              </button>
            </span>
            <a className="back-to-top" href="#top">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>

      {/* Itinerary dialog */}
      <dialog
        ref={itineraryDialogRef}
        className="itinerary"
        id="itinerary"
        aria-labelledby="itinerary-title"
        onClick={(e) => {
          if (e.target === itineraryDialogRef.current) closeItinerary();
        }}
        onClose={() => document.body.classList.remove('modal-open')}
      >
        <div className="itinerary-shell">
          <button
            className="dialog-close"
            type="button"
            aria-label="Close itinerary"
            onClick={closeItinerary}
          >
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
              <path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
          <div className="itinerary-head">
            <p className="eyebrow">
              <span className="num" id="itinerary-num">
                {activeJourneyData.num}
              </span>
              <span id="itinerary-kicker">{activeJourneyData.kicker}</span>
            </p>
            <h2 id="itinerary-title">{activeJourneyData.title}</h2>
            <p className="itinerary-sub" id="itinerary-sub">
              {activeJourneyData.sub}
            </p>
            <div className="itinerary-meta" id="itinerary-meta">
              {activeJourneyData.meta.map((m) => (
                <span key={m.label}>
                  <strong>{m.label}</strong>
                  {m.value}
                </span>
              ))}
            </div>
          </div>
          <div className="itinerary-grid">
            <div className="day-list" id="itinerary-days">
              {activeJourneyData.days.map((d, i) => (
                <div key={i} className="day">
                  <span className="day-num">Day {String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4>
                      {d.title}
                      <span>{d.place}</span>
                    </h4>
                    <p>{d.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <aside className="itinerary-aside">
              <p className="aside-label">From</p>
              <p className="aside-price" id="itinerary-price">
                {formatMoney(activeJourneyData.price[market], market)}
              </p>
              <p className="aside-note">per person · incl. flights &amp; taxes</p>
              <h3>Included</h3>
              <ul id="itinerary-included">
                {activeJourneyData.included.map((inc, i) => (
                  <li key={i}>{inc}</li>
                ))}
              </ul>
              <h3>Not included</h3>
              <ul id="itinerary-excluded">
                {activeJourneyData.excluded.map((exc, i) => (
                  <li key={i}>{exc}</li>
                ))}
              </ul>
              <button
                className="btn btn-solid"
                type="button"
                id="itinerary-enquire"
                onClick={() => {
                  closeItinerary();
                  window.setTimeout(() => startEnquiry(currentJourney), 120);
                }}
              >
                Enquire about this journey
              </button>
            </aside>
          </div>
        </div>
      </dialog>

      {/* Lightbox */}
      <dialog
        ref={lightboxDialogRef}
        className="lightbox"
        id="lightbox"
        aria-label="Gallery viewer"
        onClick={(e) => {
          if (e.target === lightboxDialogRef.current) closeLightbox();
        }}
        onClose={() => document.body.classList.remove('modal-open')}
      >
        <button
          className="lightbox-close"
          type="button"
          aria-label="Close gallery"
          onClick={closeLightbox}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
        <button
          className="lightbox-nav prev"
          type="button"
          aria-label="Previous image"
          onClick={() =>
            setGalleryIndex((prev) => (prev - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length)
          }
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
        <figure className="lightbox-figure">
          <img id="lightbox-img" src={currentGalleryItem.src} alt={currentGalleryItem.alt} />
          <figcaption>
            <span id="lightbox-caption">{currentGalleryItem.caption}</span>
            <span className="lightbox-count" id="lightbox-count">
              {String(galleryIndex + 1).padStart(2, '0')} /{' '}
              {String(GALLERY_ITEMS.length).padStart(2, '0')}
            </span>
          </figcaption>
        </figure>
        <button
          className="lightbox-nav next"
          type="button"
          aria-label="Next image"
          onClick={() => setGalleryIndex((prev) => (prev + 1) % GALLERY_ITEMS.length)}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
            <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </dialog>

      <div
        className={`toast${toastVisible ? ' is-visible' : ''}`}
        id="toast"
        role="status"
        aria-live="polite"
      >
        {toastText}
      </div>
    </>
  );
}
