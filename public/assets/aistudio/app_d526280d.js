(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ————— Currency & market ————— */

  const MARKETS = {
    uk: { name: 'United Kingdom', code: 'GBP', locale: 'en-GB', currency: 'GBP' },
    in: { name: 'India', code: 'INR', locale: 'en-IN', currency: 'INR' }
  };

  let market = document.documentElement.dataset.market === 'in' ? 'in' : 'uk';

  const money = (value, code) => {
    const m = MARKETS[code] || MARKETS.uk;
    return new Intl.NumberFormat(m.locale, {
      style: 'currency',
      currency: m.currency,
      maximumFractionDigits: 0
    }).format(value);
  };

  const marketBtn = $('.market-btn');
  const marketMenu = $('#market-menu');
  const toast = $('#toast');
  let toastTimer;

  const showToast = (text) => {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
  };

  const applyMarket = (next, { announce = false, persist = true } = {}) => {
    market = next === 'in' ? 'in' : 'uk';
    const m = MARKETS[market];
    document.documentElement.dataset.market = market;

    $$('[data-market-name]').forEach((el) => { el.textContent = m.name; });
    $$('[data-currency-code]').forEach((el) => { el.textContent = m.code; });

    $$('.js-price').forEach((el) => {
      const raw = market === 'uk' ? el.dataset.gbp : el.dataset.inr;
      if (raw !== undefined && raw !== '') {
        const value = Number(raw);
        if (!Number.isNaN(value)) el.textContent = money(value, market);
      }
    });

    $$('[data-set-market]').forEach((btn) => {
      const active = btn.dataset.setMarket === market;
      btn.setAttribute('aria-checked', String(active));
      btn.setAttribute('aria-pressed', String(active));
    });

    const country = $('#from-country');
    if (country && country.dataset.touched !== 'true') country.value = m.name;

    if (itinerary && itinerary.open) renderItinerary(currentJourney);

    if (persist) {
      try { localStorage.setItem('serendib-market', market); } catch (e) {}
    }
    if (announce) showToast(`Fares now in ${m.code} · ${m.name}`);
  };

  const closeMarketMenu = () => {
    if (!marketMenu || !marketBtn) return;
    marketMenu.hidden = true;
    marketBtn.setAttribute('aria-expanded', 'false');
  };

  if (marketBtn && marketMenu) {
    marketBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = marketMenu.hidden;
      marketMenu.hidden = !willOpen;
      marketBtn.setAttribute('aria-expanded', String(willOpen));
      if (willOpen) {
        const checked = marketMenu.querySelector('[aria-checked="true"]');
        if (checked) checked.focus({ preventScroll: true });
      }
    });

    marketMenu.addEventListener('click', (e) => e.stopPropagation());

    document.addEventListener('click', () => {
      if (!marketMenu.hidden) closeMarketMenu();
    });

    $$('[data-open-market]').forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        marketMenu.hidden = false;
        marketBtn.setAttribute('aria-expanded', 'true');
        marketBtn.focus({ preventScroll: true });
      });
    });

    $$('[data-set-market]').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyMarket(btn.dataset.setMarket, { announce: true });
        closeMarketMenu();
        closeMobileMenu();
      });
    });
  }

  /* ————— Header ————— */

  const header = $('#site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-solid', window.scrollY > 56);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ————— Mobile menu ————— */

  const menuToggle = $('.menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const menuLabel = menuToggle ? $('.menu-toggle-label', menuToggle) : null;

  const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.hidden = false;
    document.body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    if (menuLabel) menuLabel.textContent = 'Close';
    closeMarketMenu();
    const first = mobileMenu.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  };

  function closeMobileMenu() {
    if (!mobileMenu || mobileMenu.hidden) return;
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.focus({ preventScroll: true });
    }
    if (menuLabel) menuLabel.textContent = 'Menu';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      if (mobileMenu.hidden) openMobileMenu();
      else closeMobileMenu();
    });
    $$('a', mobileMenu).forEach((link) => link.addEventListener('click', closeMobileMenu));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeMarketMenu();
    if (mobileMenu && !mobileMenu.hidden) closeMobileMenu();
  });

  /* ————— Journeys & itinerary ————— */

  const JOURNEYS = {
    hill: {
      num: '01',
      kicker: 'Journey one · United Kingdom',
      title: 'The Hill Country Line',
      sub: 'Eight days from Colombo to Galle by way of the tea country — the long way round, the slow way in. Built around the overnight flight from London and the small pleasure of having nowhere to be by noon.',
      meta: [
        { label: 'Length', value: '8 days · 7 nights' },
        { label: 'Party', value: 'Private · 2–6 guests' },
        { label: 'Flights', value: 'London Heathrow' },
        { label: 'Pace', value: 'Unhurried' }
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
        { title: 'Homeward', place: 'Colombo', text: 'A coastal train back to Colombo if the mood takes you, then your evening flight home. Extra nights in Mirissa are easy to add.' }
      ],
      included: [
        'Return flights from London Heathrow, taxes included',
        'Seven nights in boutique four-star hotels',
        'Private guide and driver throughout',
        'Reserved observation car, Kandy to Ella',
        'Yala safari with a resident naturalist',
        'Daily breakfast and three dinners',
        'Sri Lanka ETA, transfers and airport support'
      ],
      excluded: ['Travel insurance', 'Lunches and drinks', 'Tips and personal expenses', 'Optional extensions']
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
        { label: 'Pace', value: 'Gentle' }
      ],
      price: { uk: 1390, in: 118000 },
      days: [
        { title: 'Arrive Colombo', place: 'Colombo', text: 'Fast-track on arrival and a short transfer into the city. Sundown at Galle Face with your guide and a pot of Ceylon tea.' },
        { title: 'The temple at dusk', place: 'Kandy', text: 'Up into the hills for the evening puja at the Temple of the Tooth — the quietest, most moving hour of the trip.' },
        { title: 'Tea country to the sea', place: 'Bentota', text: 'A morning among the tea terraces, a spice-garden lunch, then down through the coconut belt to Bentota and the sea.' },
        { title: 'The Madu River', place: 'Bentota', text: 'A boat through the mangroves before the heat of the day; the afternoon is for the pool, the beach or doing very little.' },
        { title: 'Galle, golden hour', place: 'Galle', text: 'The fort on foot: lighthouse, lanes, boutique workshops and a long walk along the ramparts as the light goes amber.' },
        { title: 'Homeward', place: 'Colombo', text: 'The coastal train back to Colombo, a last lunch by the water, and your evening flight home.' }
      ],
      included: [
        'Return flights from Mumbai, Chennai or Bengaluru',
        'Five nights in boutique hotels',
        'Private guide and driver throughout',
        'Temple of the Tooth puja visit',
        'Madu River boat safari',
        'Daily breakfast and three dinners',
        'Airport fast-track, ETA and transfers'
      ],
      excluded: ['Travel insurance', 'Lunches and drinks', 'Tips and personal expenses', 'Optional extensions']
    }
  };

  const itinerary = $('#itinerary');
  let currentJourney = 'hill';

  const renderItinerary = (key) => {
    const j = JOURNEYS[key];
    if (!j) return;

    $('#itinerary-num').textContent = j.num;
    $('#itinerary-kicker').textContent = j.kicker;
    $('#itinerary-title').textContent = j.title;
    $('#itinerary-sub').textContent = j.sub;
    $('#itinerary-price').textContent = money(j.price[market], market);

    $('#itinerary-meta').innerHTML = j.meta
      .map((m) => `<span><strong>${m.label}</strong>${m.value}</span>`)
      .join('');

    $('#itinerary-days').innerHTML = j.days
      .map((d, i) => `
        <div class="day">
          <span class="day-num">Day ${String(i + 1).padStart(2, '0')}</span>
          <div>
            <h4>${d.title}<span>${d.place}</span></h4>
            <p>${d.text}</p>
          </div>
        </div>`)
      .join('');

    $('#itinerary-included').innerHTML = j.included.map((x) => `<li>${x}</li>`).join('');
    $('#itinerary-excluded').innerHTML = j.excluded.map((x) => `<li>${x}</li>`).join('');
  };

  const openItinerary = (key) => {
    if (!itinerary || !JOURNEYS[key]) return;
    currentJourney = key;
    renderItinerary(key);
    if (!itinerary.open) {
      itinerary.showModal();
      document.body.classList.add('modal-open');
      itinerary.scrollTop = 0;
    }
    closeMarketMenu();
    closeMobileMenu();
  };

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open-itinerary]');
    if (opener) {
      e.preventDefault();
      openItinerary(opener.dataset.openItinerary);
    }
  });

  if (itinerary) {
    $('.dialog-close', itinerary).addEventListener('click', () => itinerary.close());
    itinerary.addEventListener('click', (e) => {
      if (e.target === itinerary) itinerary.close();
    });
    itinerary.addEventListener('close', () => document.body.classList.remove('modal-open'));

    $('#itinerary-enquire').addEventListener('click', () => {
      itinerary.close();
      setTimeout(() => startEnquiry(currentJourney), 120);
    });
  }

  /* ————— Destinations filter ————— */

  const filterButtons = $$('.filter-btn');
  const places = $$('.place');
  const placeCount = $('#place-count');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
      btn.setAttribute('aria-pressed', 'true');
      const filter = btn.dataset.filter;
      let visible = 0;
      places.forEach((place) => {
        const show = filter === 'all' || place.dataset.category === filter;
        place.hidden = !show;
        if (show) visible += 1;
      });
      if (placeCount) placeCount.textContent = String(visible);
    });
  });

  /* ————— Gallery lightbox ————— */

  const galleryItems = $$('.g-item');
  const lightbox = $('#lightbox');
  const lightboxImg = $('#lightbox-img');
  const lightboxCaption = $('#lightbox-caption');
  const lightboxCount = $('#lightbox-count');
  let galleryIndex = 0;

  const showSlide = (index) => {
    if (!galleryItems.length || !lightboxImg) return;
    galleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[galleryIndex];
    const img = $('img', item);
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = item.dataset.caption || img.alt;
    lightboxCount.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(galleryItems.length).padStart(2, '0')}`;
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      showSlide(index);
      if (lightbox && !lightbox.open) {
        lightbox.showModal();
        document.body.classList.add('modal-open');
      }
    });
  });

  if (lightbox) {
    $('.lightbox-close', lightbox).addEventListener('click', () => lightbox.close());
    $('.lightbox-nav.prev', lightbox).addEventListener('click', () => showSlide(galleryIndex - 1));
    $('.lightbox-nav.next', lightbox).addEventListener('click', () => showSlide(galleryIndex + 1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.close();
    });
    lightbox.addEventListener('close', () => document.body.classList.remove('modal-open'));
    document.addEventListener('keydown', (e) => {
      if (!lightbox.open) return;
      if (e.key === 'ArrowLeft') showSlide(galleryIndex - 1);
      if (e.key === 'ArrowRight') showSlide(galleryIndex + 1);
    });
  }

  /* ————— FAQ ————— */

  const faqItems = $$('.faq-item');
  faqItems.forEach((item) => {
    const button = $('.faq-q', item);
    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');
      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        $('.faq-q', other).setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ————— Enquiry form ————— */

  const form = $('#enquiry-form');
  const panel = $('#enquiry-panel');
  const successPanel = $('.form-success', panel || document);
  const countrySelect = $('#from-country');

  if (countrySelect) {
    countrySelect.addEventListener('change', () => {
      countrySelect.dataset.touched = 'true';
    });
  }

  const validateField = (input) => {
    const wrapper = input.closest('.field') || input.closest('.check-field');
    if (!wrapper) return true;
    const errorEl = $('.field-error', wrapper);
    let message = '';

    if (input.type === 'checkbox') {
      if (!input.checked) message = 'Please confirm we may contact you.';
    } else if (input.type === 'email') {
      const value = input.value.trim();
      if (!value) message = 'Please add your email address.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) message = 'Please check the email address.';
    } else if (input.required && !input.value.trim()) {
      message = 'This field is required.';
    }

    if (message) {
      wrapper.classList.add('is-invalid');
      if (errorEl) errorEl.textContent = message;
      input.setAttribute('aria-invalid', 'true');
      return false;
    }
    wrapper.classList.remove('is-invalid');
    if (errorEl) errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
    return true;
  };

  const resetEnquiry = () => {
    if (!form || !panel) return;
    form.reset();
    panel.classList.remove('is-sent');
    $$('.is-invalid', form).forEach((el) => el.classList.remove('is-invalid'));
    $$('.field-error', form).forEach((el) => { el.textContent = ''; });
    $$('[aria-invalid]', form).forEach((el) => el.removeAttribute('aria-invalid'));
    if (countrySelect) {
      delete countrySelect.dataset.touched;
      countrySelect.value = MARKETS[market].name;
    }
  };

  const resetBtn = $('#reset-enquiry');
  if (resetBtn) resetBtn.addEventListener('click', resetEnquiry);

  function startEnquiry(journeyKey) {
    if (!panel || !form) return;
    if (panel.classList.contains('is-sent')) resetEnquiry();
    const journeySelect = $('#journey-select');
    if (journeySelect && (journeyKey === 'hill' || journeyKey === 'south')) {
      journeySelect.value = journeyKey;
    }
    const target = $('#enquire');
    if (target) target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => {
      const name = $('#name');
      if (name) name.focus({ preventScroll: true });
    }, prefersReduced ? 50 : 650);
  }

  $$('[data-enquire-journey]').forEach((btn) => {
    btn.addEventListener('click', () => startEnquiry(btn.dataset.enquireJourney));
  });

  if (form) {
    form.addEventListener('input', (e) => {
      const wrapper = e.target.closest('.field') || e.target.closest('.check-field');
      if (wrapper && wrapper.classList.contains('is-invalid')) validateField(e.target);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = $$('[required]', form);
      let valid = true;
      required.forEach((input) => {
        if (!validateField(input)) valid = false;
      });
      if (!valid) {
        const firstInvalid = $('.is-invalid input, .is-invalid select', form);
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      panel.classList.add('is-sent');
      if (successPanel) successPanel.focus({ preventScroll: true });
      panel.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* ————— Newsletter ————— */

  const newsletter = $('#newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('input', newsletter);
      const status = $('#newsletter-status');
      if (!input || !input.value.trim() || !input.value.includes('@')) {
        if (status) status.textContent = 'Please enter a valid email address.';
        if (input) input.focus();
        return;
      }
      if (status) status.textContent = 'Thank you — the next dispatch is on its way.';
      newsletter.reset();
    });
  }

  /* ————— Reveal on scroll ————— */

  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window) {
    try {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
      revealEls.forEach((el) => io.observe(el));
    } catch (err) {
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ————— Nav active state ————— */

  const navLinks = $$('.primary-nav a');
  const sections = navLinks
    .map((link) => ({ link, section: $(link.getAttribute('href')) }))
    .filter((item) => item.section);

  if ('IntersectionObserver' in window && sections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => link.classList.remove('is-active'));
        const match = sections.find((item) => item.section === entry.target);
        if (match) match.link.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((item) => navObserver.observe(item.section));
  }

  /* ————— Init ————— */

  applyMarket(market, { persist: false });
})();
