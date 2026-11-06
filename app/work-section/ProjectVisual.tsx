import Image, { StaticImageData } from "next/image";
import type { CSSProperties } from "react";
import pich from "../../public/projects/pich.png";
import butler from "../../public/projects/butler.png";
import salamly from "../../public/projects/salamly.png";
import absher from "../../public/projects/absher.png";
import jemWebsite from "../../public/projects/portfolio/jem-website.webp";
import jemAppOne from "../../public/projects/portfolio/jem-1.webp";
import jemAppTwo from "../../public/projects/portfolio/jem-2.webp";
import watchWebsite from "../../public/projects/portfolio/watch-and-check-website.webp";
import watchAppOne from "../../public/projects/portfolio/watch-and-check-1.webp";
import watchAppTwo from "../../public/projects/portfolio/watch-and-check-2.webp";
import blackbookOne from "../../public/projects/portfolio/blackbook-1.webp";
import blackbookTwo from "../../public/projects/portfolio/blackbook-2.webp";
import blackbookThree from "../../public/projects/portfolio/blackbook-3.webp";
import abutWebsite from "../../public/projects/portfolio/abut-website.webp";
import abutAppOne from "../../public/projects/portfolio/abut-1.webp";
import abutAppTwo from "../../public/projects/portfolio/abut-2.webp";
import feedme from "../../public/projects/portfolio/feedmezw-2.webp";
import loveOne from "../../public/projects/portfolio/love-one-fish-1.webp";
import loveTwo from "../../public/projects/portfolio/love-one-fish-2.webp";
import loveThree from "../../public/projects/portfolio/love-one-fish-3.webp";
import devotionalHome from "../../public/projects/portfolio/daily-empowerment-android-1.webp";
import devotionalBooks from "../../public/projects/portfolio/daily-empowerment-android-2.webp";
import devotionalDetail from "../../public/projects/portfolio/daily-empowerment-detail.webp";
import worldOnPlateDesktop from "../../public/projects/portfolio/world-on-plate-desktop.webp";
import worldOnPlateMobile from "../../public/projects/portfolio/world-on-plate-mobile.webp";
import sheHerWebsite from "../../public/projects/portfolio/she-and-her-website.webp";
import sheHerWelcome from "../../public/projects/portfolio/she-and-her-welcome.webp";
import sheHerDiscovery from "../../public/projects/portfolio/she-and-her-discovery.webp";
import bibleAlertOne from "../../public/projects/portfolio/bible-alert-1.png";
import bibleAlertTwo from "../../public/projects/portfolio/bible-alert-2.png";
import bibleAlertThree from "../../public/projects/portfolio/bible-alert-3.png";
import ramsonsOne from "../../public/projects/portfolio/ramsons-1.png";
import ramsonsTwo from "../../public/projects/portfolio/ramsons-2.png";
import ramsonsThree from "../../public/projects/portfolio/ramsons-3.png";
import tengaiOne from "../../public/projects/portfolio/tengai-pos-1.png";
import tengaiTwo from "../../public/projects/portfolio/tengai-pos-2.png";
import tengaiThree from "../../public/projects/portfolio/tengai-pos-3.png";

export type VisualFormat =
  | "screens"
  | "posters"
  | "wide"
  | "composite"
  | "website"
  | "websiteApps";

type Visual = {
  images: { src: StaticImageData; alt: string }[];
  background: string;
  format: VisualFormat;
  caption: string;
};

export const visuals: Record<number, Visual> = {
  13: {
    images: [
      {
        src: sheHerWebsite,
        alt: "She & HER website introducing its community for women who love women",
      },
      {
        src: sheHerWelcome,
        alt: "She & HER mobile app welcome and onboarding screen",
      },
      {
        src: sheHerDiscovery,
        alt: "She & HER mobile profile discovery and connections interface",
      },
    ],
    background: "#493d37",
    format: "websiteApps",
    caption: "Mobile & web · Welcome and profile discovery",
  },
  0: {
    images: [
      {
        src: pich,
        alt: "PICH fruit marketplace mobile app and administration interface",
      },
    ],
    background: "#243b35",
    format: "composite",
    caption: "Mobile & web interface",
  },
  1: {
    images: [
      {
        src: butler,
        alt: "Butler cleaning services mobile app and booking interface",
      },
    ],
    background: "#293a42",
    format: "composite",
    caption: "Mobile & web interface",
  },
  2: {
    images: [
      {
        src: salamly,
        alt: "Salamly community app with posts and social features",
      },
    ],
    background: "#243c38",
    format: "composite",
    caption: "Mobile app interface",
  },
  3: {
    images: [
      {
        src: absher,
        alt: "Absher delivery and everyday services app interface",
      },
    ],
    background: "#3b3042",
    format: "composite",
    caption: "Mobile app interface",
  },
  4: {
    images: [
      {
        src: watchWebsite,
        alt: "Watch And Check website presenting watch component comparison and three app screens",
      },
      {
        src: watchAppOne,
        alt: "Watch And Check app brand discovery and search",
      },
      {
        src: watchAppTwo,
        alt: "Watch And Check app watch details and reference lookup",
      },
    ],
    background: "#101010",
    format: "websiteApps",
    caption: "Mobile & web interface",
  },
  5: {
    images: [
      {
        src: blackbookOne,
        alt: "Black Book service categories and professional discovery",
      },
      {
        src: blackbookTwo,
        alt: "Black Book appointment booking product preview",
      },
      {
        src: blackbookThree,
        alt: "Black Book professional listings and appointment discovery",
      },
    ],
    background: "#422d24",
    format: "posters",
    caption: "Google Play previews",
  },
  6: {
    images: [
      {
        src: abutWebsite,
        alt: "Abut website with product search, travel categories, and destination discovery",
      },
      { src: abutAppOne, alt: "Abut app shopping, food, and travel discovery" },
      { src: abutAppTwo, alt: "Abut app stories and promotional carousel" },
    ],
    background: "#393150",
    format: "websiteApps",
    caption: "Mobile & web interface",
  },
  7: {
    images: [
      { src: feedme, alt: "FeedmeZW food ordering and delivery app preview" },
    ],
    background: "#4b252b",
    format: "wide",
    caption: "App Store preview",
  },
  8: {
    images: [
      {
        src: jemWebsite,
        alt: "Jem.social website presentation with influencer discovery filters and creator profiles",
      },
      { src: jemAppOne, alt: "Jem.social app creator discovery filters" },
      {
        src: jemAppTwo,
        alt: "Jem.social app creator profiles and collaboration offers",
      },
    ],
    background: "#302849",
    format: "websiteApps",
    caption: "Mobile & web interface",
  },
  9: {
    images: [
      { src: loveOne, alt: "Love One Fish social discovery app preview" },
      { src: loveTwo, alt: "Love One Fish matching and swipe interface" },
      {
        src: loveThree,
        alt: "Love One Fish profile detail and photo highlights",
      },
    ],
    background: "#392237",
    format: "posters",
    caption: "App Store previews",
  },
  11: {
    images: [
      {
        src: devotionalHome,
        alt: "Daily Empowerment devotional dashboard and daily bread section",
      },
      {
        src: devotionalBooks,
        alt: "Daily Empowerment publication categories and author titles",
      },
      {
        src: devotionalDetail,
        alt: "Daily Empowerment reader with bookmarking and audio play",
      },
    ],
    background: "#16424a",
    format: "posters",
    caption: "Google Play previews",
  },
  12: {
    images: [
      {
        src: worldOnPlateDesktop,
        alt: "World on Plate website exploring recipes by world map and region",
      },
      {
        src: worldOnPlateMobile,
        alt: "World on Plate mobile view of recipe discovery by map",
      },
    ],
    background: "#2d3c2c",
    format: "website",
    caption: "Responsive web interface",
  },
  14: {
    images: [
      {
        src: bibleAlertOne,
        alt: "Bible Alert daily scripture notifications and feed",
      },
      {
        src: bibleAlertTwo,
        alt: "Bible Alert category selection and bookmarking",
      },
      {
        src: bibleAlertThree,
        alt: "Bible Alert clean reading view with reflections",
      },
    ],
    background: "#34372b",
    format: "screens",
    caption: "App Store previews",
  },
  15: {
    images: [
      {
        src: ramsonsOne,
        alt: "Ramsons retail catalog with product categories",
      },
      {
        src: ramsonsTwo,
        alt: "Ramsons order placement and tracking interface",
      },
      {
        src: ramsonsThree,
        alt: "Ramsons customer account and transaction history",
      },
    ],
    background: "#2a3d34",
    format: "screens",
    caption: "Mobile app interface",
  },
  16: {
    images: [
      {
        src: tengaiOne,
        alt: "Tengai POS point of sale terminal with live order grid",
      },
      {
        src: tengaiTwo,
        alt: "Tengai POS receipt generation and payment methods",
      },
      {
        src: tengaiThree,
        alt: "Tengai POS inventory reconciliation and daily sales reports",
      },
    ],
    background: "#3e2723",
    format: "screens",
    caption: "Google Play previews",
  },
  10: {
    images: [
      {
        src: absher,
        alt: "Absher mobile app presentation",
      },
    ],
    background: "#1f2937",
    format: "composite",
    caption: "Mobile app interface",
  },
};

export default function ProjectVisual({
  id,
  compact = false,
  featured = false,
  inDialog = false,
  priority = false,
  showCaption = true,
}: {
  id: number;
  compact?: boolean;
  featured?: boolean;
  inDialog?: boolean;
  priority?: boolean;
  showCaption?: boolean;
}) {
  const visual = visuals[id];
  if (!visual) return null;
  return (
    <figure
      className={`pv-visual pv-${visual.format} ${
        compact ? "pv-compact" : ""
      } ${featured ? "pv-featured" : ""} ${inDialog ? "pv-inDialog" : ""} ${
        id === 6 ? "pv-abutWebsite" : ""
      }`}
      style={{ "--preview-bg": visual.background } as CSSProperties}
    >
      {visual.format === "websiteApps" ? (
        <div className="pv-combinedStage">
          <div className="pv-laptopFrame">
            <div className="pv-laptopDisplay">
              <Image
                src={visual.images[0].src}
                alt={visual.images[0].alt}
                sizes={
                  featured || inDialog
                    ? "(max-width: 800px) 75vw, 620px"
                    : "(max-width: 800px) 65vw, 450px"
                }
                priority={priority}
              />
            </div>
          </div>
          {visual.images.slice(1).map((image, index) => (
            <div
              key={image.alt}
              className={`pv-companionScreen ${
                index === 0 ? "pv-companionLeft" : "pv-companionRight"
              } pv-phoneBezel`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                sizes="(max-width: 540px) 20vw, 150px"
                priority={priority}
              />
            </div>
          ))}
        </div>
      ) : visual.format === "website" ? (
        <div className="pv-websiteStage">
          <div className="pv-browserFrame">
            <div className="pv-browserBar" aria-hidden="true">
              <span className="pv-browserDots">
                <i />
                <i />
                <i />
              </span>
              <span className="pv-browserAddress">worldonplate.com</span>
            </div>
            <Image
              src={visual.images[0].src}
              alt={visual.images[0].alt}
              sizes="(max-width: 800px) 80vw, 520px"
            />
          </div>
          <div className="pv-mobileFrame">
            <Image
              src={visual.images[1].src}
              alt={visual.images[1].alt}
              sizes="(max-width: 540px) 26vw, 140px"
            />
          </div>
        </div>
      ) : (
        <div
          className={`pv-stage ${
            visual.images.length > 2
              ? "pv-triple"
              : visual.images.length > 1
              ? "pv-pair"
              : ""
          }`}
        >
          {visual.images.map((image) => (
            <Image
              key={image.alt}
              src={image.src}
              alt={image.alt}
              sizes={
                visual.format === "wide" ||
                visual.format === "composite" ||
                visual.format === "websiteApps"
                  ? "(max-width: 800px) 85vw, 550px"
                  : visual.images.length > 2
                  ? "(max-width: 540px) 26vw, 160px"
                  : "(max-width: 540px) 38vw, 220px"
              }
              priority={priority}
            />
          ))}
        </div>
      )}
      {showCaption && <figcaption>{visual.caption}</figcaption>}
    </figure>
  );
}
