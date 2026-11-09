import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  X
} from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";
import CategorySection from "../Components/CategorySection";
import "../Styles/Home.css";

const heroSlides = [
  {
    src: "/images/hero/home-hero-01.jpg",
    alt: "Navy and grey embroidered saree displayed on a mannequin"
  },
  {
    src: "/images/hero/home-hero-02.jpg",
    alt: "Woman wearing an ivory and plum traditional lehenga"
  },
  {
    src: "/images/hero/home-hero-03.jpg",
    alt: "Woman wearing a black sleeveless midi dress"
  },
  {
    src: "/images/hero/home-hero-04.jpg",
    alt: "Blue gingham crop top styled with white jeans"
  }
];

const socialLinks = [
  {
    name: "Instagram",
    url: "https://www.instagram.com/hynifashionstudio/",
    icon: FaInstagram,
    iconClass: "instagram"
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/?text=Hi%20Hyni%20Fashion%20Studio",
    icon: FaWhatsapp,
    iconClass: "whatsapp"
  }
];

function qrCodeUrl(url) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeScanner, setActiveScanner] = useState(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!activeScanner) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setActiveScanner(null);
    }

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [activeScanner]);

  return (
    <>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} /> THE NEW SEASON COLLECTION
          </span>

          <h1>
            Wear your story.
            <br />
            <span>Own your elegance.</span>
          </h1>

          <p>
            Discover beautiful everyday outfits, festive sarees, elegant
            kurtis, and statement dresses selected for your special moments.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="primary-btn">
              Explore Collection <ArrowRight size={18} />
            </Link>

            <a href="#categories" className="outline-btn">
              Discover styles
            </a>
          </div>

        </div>

        <div className="hero-image-wrap">
          <img
            key={heroSlides[activeSlide].src}
            src={heroSlides[activeSlide].src}
            alt={heroSlides[activeSlide].alt}
            className="hero-image"
          />

          <div className="hero-slide-controls" aria-label="Hero image selection">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src}
                className={index === activeSlide ? "active" : ""}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show image ${index + 1}`}
                aria-pressed={index === activeSlide}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="social-scan-section container" aria-label="Connect with Hyni">
        <Link
          className="offer-popup"
          to="/category/dresses"
          aria-label="Dress offer is live. Grab the offer"
        >
          <strong className="offer-popup-backdrop-text" aria-hidden="true">
            DRESS
            <br />
            OFFER!
          </strong>
          <div className="offer-popup-copy">
            <span className="offer-popup-live">
              <span className="offer-live-indicator" />
              OFFER IS LIVE
            </span>
            <span className="offer-popup-speech">Hey! Don’t miss it!</span>
            <span className="offer-popup-cta">GRAB THE OFFER <ArrowRight size={15} /></span>
          </div>
          <span className="offer-popup-sparkle offer-popup-sparkle-one" aria-hidden="true">✦</span>
          <span className="offer-popup-sparkle offer-popup-sparkle-two" aria-hidden="true">✧</span>
        </Link>

        <div className="social-scan-panel">
          <div className="social-scan-heading">
            <span className="eyebrow">STAY CONNECTED</span>
            <h2 id="social-scan-title">Scan to connect</h2>
            <p>Tap an icon to open its QR scanner.</p>
          </div>
          <div className="social-scan-cards">
            {socialLinks.map(({ name, icon: Icon, iconClass, ...socialLink }) => (
              <button
                key={name}
                className="social-scan-card"
                type="button"
                onClick={() => setActiveScanner({ name, ...socialLink })}
                aria-label={`Open ${name} QR scanner`}
                aria-haspopup="dialog"
              >
                <span className={`social-scan-icon social-scan-icon-${iconClass}`}>
                  <Icon size={28} aria-hidden="true" />
                </span>
                <span>{name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeScanner && (
        <div
          className="scanner-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveScanner(null);
          }}
        >
          <section
            className="scanner-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="scanner-title"
          >
            <button
              className="scanner-close"
              type="button"
              onClick={() => setActiveScanner(null)}
              aria-label="Close QR scanner"
              autoFocus
            >
              <X size={20} />
            </button>
            <span className="scanner-eyebrow">CONNECT WITH HYNI</span>
            <h2 id="scanner-title">Scan for {activeScanner.name}</h2>
            <p>Point your phone camera at this code to connect.</p>
            <div className="scanner-qr-frame">
              <img
                src={qrCodeUrl(activeScanner.url)}
                alt={`${activeScanner.name} QR code for Hyni Fashion Studio`}
              />
              <span className="scanner-beam" aria-hidden="true" />
            </div>
            <a
              className="scanner-open-link"
              href={activeScanner.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open {activeScanner.name} <ExternalLink size={16} />
            </a>
          </section>
        </div>
      )}

      <CategorySection />
    </>
  );
}