"use client";

import {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import CarFeatureSidebar from "@/components/CarFeatureSidebar";
import CarouselNavigation from "@/components/CarouselNavigation";
import SousSlider from "@/components/SousSlider";
import ToggleButton from "@/components/ToggleButton";
import React from "react";

const TorresHybridPage = () => {
  const { t, language } = useTranslation();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSecondSectionVisible, setIsSecondSectionVisible] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [currentHotspotImage, setCurrentHotspotImage] = useState(0);
  const [viewMode, setViewMode] = useState<"color" | "vr">("color");
  const [selectedColor, setSelectedColor] = useState(0);
  const [toneMode, setToneMode] = useState<"1 TONE" | "2 TONE">("2 TONE");
  // 360° VR Rotation System - Instant Updates Configuration
  const SENSITIVITY = 2.0; // Higher sensitivity for more responsive rotation
  const DEADZONE_PIXELS = 1; // Minimum drag distance before rotation starts
  const FRAME_COUNT = 36; // Total number of rotation frames

  const [currentFrame, setCurrentFrame] = useState(0);
  const [targetFrame, setTargetFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const currentFrameRef = useRef(0);
  const [dragStart, setDragStart] = useState(0);
  const [lastDragTime, setLastDragTime] = useState(0);
  const [lastDragX, setLastDragX] = useState(0);
  const [currentSafetyCard, setCurrentSafetyCard] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [videoPlaying, setVideoPlaying] = useState<boolean>(false);
  const [currentConvenienceCard, setCurrentConvenienceCard] = useState(0);
  const [currentPerformanceCard, setCurrentPerformanceCard] = useState(0);
  const [isADASCarouselOpen, setIsADASCarouselOpen] = useState(false);
  const [isESCCarouselOpen, setIsESCCarouselOpen] = useState(false);
  const [isAdditionalSafetyCarouselOpen, setIsAdditionalSafetyCarouselOpen] =
    useState(false);
  const [isSeatingConfigCarouselOpen, setIsSeatingConfigCarouselOpen] =
    useState(false);
  const [isMoreFeaturesCarouselOpen, setIsMoreFeaturesCarouselOpen] =
    useState(false);
  const [currentSpecImage, setCurrentSpecImage] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(3); // TYRE INFORMATION is open by default
  const [activeSpecAccordion, setActiveSpecAccordion] = useState(0); // DIMENSIONS is open by default
  const [activeAccessoryTab, setActiveAccessoryTab] = useState<
    "exterior" | "interior"
  >("exterior");
  const [isInteriorSideMenuOpen, setIsInteriorSideMenuOpen] = useState(false);
  const [selectedInteriorHotspot, setSelectedInteriorHotspot] = useState<
    string | null
  >(null);
  const [currentInteriorHotspotImage, setCurrentInteriorHotspotImage] =
    useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [exteriorImageAspect, setExteriorImageAspect] = useState<number | null>(
    null
  );
  const [exteriorCarView, setExteriorCarView] = useState<"front" | "rear">(
    "front"
  );
  const [dayNightView, setDayNightView] = useState<"front" | "rear">("front");
  const [dayNightSplit, setDayNightSplit] = useState(50);
  const [isDayNightDragging, setIsDayNightDragging] = useState(false);
  const dayNightSliderRef = useRef<HTMLDivElement>(null);

  const updateDayNightSplit = useCallback((clientX: number) => {
    const el = dayNightSliderRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setDayNightSplit(percent);
  }, []);

  useEffect(() => {
    if (!isDayNightDragging) return;
    const onMove = (e: MouseEvent) => updateDayNightSplit(e.clientX);
    const onUp = () => setIsDayNightDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [isDayNightDragging, updateDayNightSplit]);

  const [exteriorRearImageAspect, setExteriorRearImageAspect] = useState<
    number | null
  >(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: section2Ref,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: section4ScrollProgress } = useScroll({
    target: section4Ref,
    offset: ["start end", "end start"],
  });

  // Transform values for scroll animations
  const videoWidth = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["30%", "70%", "100%"]
  );
  const videoHeight = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["auto", "80%", "100%"]
  );
  const textSize = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [
      "clamp(2rem, 6vw, 4rem)",
      "clamp(1.8rem, 5vw, 3rem)",
      "clamp(1.5rem, 4vw, 2.5rem)",
    ]
  );

  // Transform values for section 4 (Driver-Centric Cockpit)
  const section4VideoWidth = useTransform(
    section4ScrollProgress,
    [0, 0.15, 0.3, 0.45, 0.6, 1],
    ["30%", "50%", "70%", "100%", "100%", "100%"]
  );
  const section4TextScale = useTransform(
    section4ScrollProgress,
    [0, 0.2, 0.4, 0.5, 0.6, 1],
    [0, 0.2, 0.5, 0.8, 1, 1]
  );
  const section4TextOpacity = useTransform(
    section4ScrollProgress,
    [0, 0.2, 0.4, 0.5, 0.6, 1],
    [0, 0, 0.3, 0.7, 1, 1]
  );
  const section4Sticky = useTransform(
    section4ScrollProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0]
  );

  const textLineHeight = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.2, 1.3, 1.4]
  );
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [1, 1, 0.9, 0.8]
  );
  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 0]);

  // Mobile detection for responsive design - use useLayoutEffect for immediate check
  useLayoutEffect(() => {
    const checkMobile = () => {
      if (typeof window !== "undefined") {
        setIsMobile(window.innerWidth < 768);
      }
    };

    // Check immediately on mount (synchronous, before paint)
    checkMobile();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  const features = [
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/hero/20250124172442986_VZpfKQ.svg",
      title: language === "fr" ? "Esprit d'Aventure" : "Spirit of Adventure",
      description:
        language === "fr"
          ? "Découvrez de nouveaux horizons avec le Torres, conçu pour l'aventure et l'exploration."
          : "Discover new horizons with the Torres, designed for adventure and exploration.",
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/hero/20250124172458046_LBeV4i.svg",
      title: language === "fr" ? "Extérieur Audacieux" : "Bold Exterior",
      description:
        language === "fr"
          ? "Un design extérieur audacieux et moderne qui se distingue sur la route."
          : "A bold and modern exterior design that stands out on the road.",
    },
    {
      icon: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/hero/20250124172512877_nxoBQR.svg",
      title: language === "fr" ? "Intérieur Intelligent" : "Smart Interior",
      description:
        language === "fr"
          ? "Un intérieur intelligent et fonctionnel pour une expérience de conduite optimale."
          : "A smart and functional interior for an optimal driving experience.",
    },
  ];

  // Safety features data (Supabase storage)
  const SAFETY_MEDIA_BASE =
    "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/interior/security";
  const CONVENIENCE_MEDIA_BASE =
    "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/interior/CONVENIENCE";
  const PERFORMANCE_MEDIA_BASE =
    "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/interior/PERFORMANCE";
  const safetyFeatures = [
    {
      id: 0,
      title: language === "fr" ? "Système ADAS" : "ADAS System",
      subtitle:
        language === "fr"
          ? "Contrôle de Croisière Adaptatif Intelligent (ACC & SSA)"
          : "Intelligent Adaptive Cruise Control (ACC & SSA)",
      description:
        language === "fr"
          ? "L'ACC & SSA aide à maintenir une distance de sécurité avec le véhicule devant en fonction de la vitesse définie (lors de l'accélération, de la décélération, de l'arrêt et du démarrage) et assiste la conduite à une vitesse sûre."
          : "ACC & SSA help maintaining a safe distance from the vehicle ahead based on the set speed (when accelerating, decelerating, stopping, and starting) and assists driving at a safe speed.",
      image: `${SAFETY_MEDIA_BASE}/20250905114403989_HMRPWb.jpg`,
      video: `${SAFETY_MEDIA_BASE}/20250905114404171_B6aX4I.mp4`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 1,
      title: language === "fr" ? "Système ADAS" : "ADAS System",
      subtitle:
        language === "fr"
          ? "Freinage d'Urgence Autonome (AEB)"
          : "Autonomous Emergency Braking (AEB)",
      description:
        language === "fr"
          ? "L'AEB avertit le conducteur d'une collision frontale potentielle pendant la conduite et active automatiquement les freins pour éviter un accident."
          : "AEB warns the driver of a potential frontal collision while driving and automatically activates the brakes to prevent an accident.",
      image: `${SAFETY_MEDIA_BASE}/20250908114309530_2m9IDd.jpg`,
      video: `${SAFETY_MEDIA_BASE}/20250908114250257_4twz1L.mp4`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true,
    },
    {
      id: 2,
      title:
        language === "fr"
          ? "Direction plus sûre lors du remorquage"
          : "Safer steering when towing",
      subtitle:
        language === "fr"
          ? "Assistance à la Stabilité du Remorque (TSA)"
          : "Trailer Stability Assist (TSA)",
      description:
        language === "fr"
          ? "Lors du remorquage d'une remorque ou d'une caravane, le TSA stabilise le contrôle de direction en réponse au balancement latéral causé par des conditions routières difficiles."
          : "When towing a trailer or caravan, TSA stabilizes steering control in response to side-to-side swaying caused by harsh road conditions.",
      image: `${SAFETY_MEDIA_BASE}/20250908115857156_HLwunJ.jpg`,
      video: `${SAFETY_MEDIA_BASE}/20250908115857397_8SccN7.mp4`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 3,
      title:
        language === "fr"
          ? "Conception priorisant la sécurité"
          : "Safety-prioritized design",
      subtitle:
        language === "fr"
          ? "78% Acier haute résistance"
          : "78% High-strength steel",
      description:
        language === "fr"
          ? "Grâce au procédé HPF (Hot Press Forming), à l'utilisation de plaques d'acier à haute résistance (44 %) et ultra-haute résistance (34 %), la rigidité de la carrosserie ainsi que la sécurité des passagers ont été portées à leur maximum."
          : "By applying the HPF (Hot Press Forming) process with high-strength (44%) and ultra-high-strength (34%) steel plates, the rigidity of the body and passenger safety have been maximized.",
      image: `${SAFETY_MEDIA_BASE}/20250908120154774_AJdSZv.jpg`,
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 4,
      title:
        language === "fr"
          ? "Incluant un airbag latéral éloigné en 1ère rangée"
          : "Including a far-side airbag in the 1st row",
      subtitle: language === "fr" ? "8 Airbags" : "8 Airbags",
      description:
        language === "fr"
          ? "Il y a 8 airbags à l'intérieur du véhicule incluant un airbag latéral éloigné pour la rangée avant."
          : "There are 8 airbags inside the vehicle including one far-side airbag for the front row.",
      image: `${SAFETY_MEDIA_BASE}/20250908120447473_1r71b2.jpg`,
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 5,
      title:
        language === "fr"
          ? "Sécurité assurée dans toutes les conditions de conduite"
          : "Secured safety in all driving conditions",
      subtitle:
        language === "fr"
          ? "Contrôle Électronique de Stabilité (ESC)"
          : "Electronic Stability Control (ESC)",
      description:
        language === "fr"
          ? "L'ESC fournit diverses fonctionnalités pour prévenir les accidents à l'avance en assurant un contrôle stable de la posture du véhicule dans diverses conditions de conduite."
          : "ESC provides various features to prevent accidents in advance by ensuring stable vehicle posture control in a variety of driving conditions.",
      image: `${SAFETY_MEDIA_BASE}/20250908120841405_YTr5wQ.jpg`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true,
    },
    {
      id: 6,
      title: language === "fr" ? "Système ESC avancé" : "Advanced ESC system",
      subtitle:
        language === "fr"
          ? "Frein Multi-Collision (MCB)"
          : "Multi Collision Brake (MCB)",
      description:
        language === "fr"
          ? "Après qu'un accident se produise, le MCB prévient les accidents secondaires par freinage d'urgence automatique lorsque le conducteur est temporairement incapable de contrôler le véhicule."
          : "After an accident occurs, the MCB prevents secondary accidents through automatic emergency braking when the driver is temporarily unable to control the vehicle.",
      image: `${SAFETY_MEDIA_BASE}/20250908135309505_H6QxDX.jpg`,
      video: `${SAFETY_MEDIA_BASE}/20250908135309640_fVSfm2.mp4`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 7,
      title: language === "fr" ? "" : "",
      subtitle:
        language === "fr"
          ? "Fonctionnalités de sécurité supplémentaires"
          : "Additional safety features",
      description: language === "fr" ? "" : "",
      image: `${SAFETY_MEDIA_BASE}/20250908135721968_0a2HlJ.jpg`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true,
    },
  ];

  // ADAS System Carousel Data (KG Mobility 2000003000100090004)
  const adasCarouselData = React.useMemo(
    () => [
      {
        id: 0,
        title:
          language === "fr"
            ? "Avertissement de Sortie de Sécurité (SEW)"
            : "Safety Exit Warning (SEW)",
        description:
          language === "fr"
            ? "Lorsqu'un conducteur ou un passager tente de sortir du véhicule à l'arrêt, le SEW alerte le conducteur et les passagers avec des lumières d'avertissement et des sons."
            : "When a driver or passenger attempts to exit the vehicle when stationary, SEW alerts the driver and passengers with warning lights and sounds.",
        video: `${SAFETY_MEDIA_BASE}/20250908114506051_SKZX9r.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908114505891_H589W2.jpg`,
      },
      {
        id: 1,
        title:
          language === "fr"
            ? "Avertissement de Démarrage du Véhicule Avant (FVSW)"
            : "Front Vehicle Start Warning (FVSW)",
        description:
          language === "fr"
            ? "Le FVSW attire l'attention du conducteur avec une alerte visuelle pop-up et un son audible lorsque le véhicule directement devant s'éloigne."
            : "FVSW attracts the driver's attention with a visual pop-up alert and audible sound when the vehicle directly in front is pulling away.",
        video: `${SAFETY_MEDIA_BASE}/20250908114540059_rLB0dj.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908114539887_XEvc5p.jpg`,
      },
      {
        id: 2,
        title:
          language === "fr"
            ? "Avertissement de Distance de Sécurité (SDW)"
            : "Safety Distance Warning (SDW)",
        description:
          language === "fr"
            ? "Le SDW détecte la distance du véhicule qui précède et avertit le conducteur lorsqu'une distance de sécurité n'est pas correctement maintenue."
            : "SDW detects the distance from the vehicle ahead and warns the driver when a safe distance is not properly maintained.",
        video: `${SAFETY_MEDIA_BASE}/20250908114655566_PllyBX.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908114655447_POidFG.jpg`,
      },
      {
        id: 3,
        title:
          language === "fr"
            ? "Feux de Route Intelligents (SHB)"
            : "Smart High Beam (SHB)",
        description:
          language === "fr"
            ? "Le SHB abaisse automatiquement les feux de route lorsqu'un véhicule approchant est détecté, rendant la conduite nocturne plus facile et plus sûre."
            : "SHB detects road brightness and oncoming traffic conditions, automatically switching between high and low beams to support safer driving in various situations.",
        video: `${SAFETY_MEDIA_BASE}/20250908114950233_ttnGRp.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908114950092_cxnHJ0.jpg`,
      },
      {
        id: 4,
        title:
          language === "fr"
            ? "Assistance Intelligente à la Vitesse (ISA)"
            : "Intelligent Speed Assist (ISA)",
        description:
          language === "fr"
            ? "Sur l'autoroute, l'ISA permet une conduite sûre en avertissant le conducteur des limites de vitesse."
            : "While driving on the highway, ISA allows for safe driving by warning speed limits to the driver.",
        image: `${SAFETY_MEDIA_BASE}/20250908115148594_AwNMjt.jpg`,
      },
      {
        id: 5,
        title:
          language === "fr"
            ? "Avertissement de Circulation Transversale Arrière (RCTW) / Assistance de Collision de Circulation Transversale Arrière (RCTA)"
            : "Rear Cross Traffic Warning (RCTW) / Rear Cross Traffic Collision Assist (RCTA)",
        description:
          language === "fr"
            ? "En stationnement ou en marche arrière, le RCTW/RCTA détecte les objets s'approchant du véhicule et alerte le conducteur d'une collision potentielle et active le freinage d'urgence."
            : "While parked or in reverse, RCTW/RCTA detects objects approaching towards the vehicle and alerts the driver of a potential collision and activates emergency braking.",
        video: `${SAFETY_MEDIA_BASE}/20250908115253555_JiW7sz.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908115253443_q1yGbt.jpg`,
      },
      {
        id: 6,
        title:
          language === "fr"
            ? "Détection d'Avertissement d'Angle Mort (BSW) / Assistance de Collision d'Angle Mort (BSA)"
            : "Blind Spot Detection Warning (BSW) / Blind Spot Collision Assist (BSA)",
        description:
          language === "fr"
            ? "Le BSW/BSA assiste automatiquement le freinage lorsque le conducteur change de voie et que le système détecte un risque de collision avec des véhicules dans l'angle mort."
            : "BSW/BSA automatically assists braking when the driver changes lanes and the system detects a risk of collision with vehicles in the blind spot.",
        video: `${SAFETY_MEDIA_BASE}/20250908115347130_c8uGT8.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908115347025_7rxYNv.jpg`,
      },
      {
        id: 7,
        title:
          language === "fr"
            ? "Avertissement d'Attention de Somnolence du Conducteur (DDAW)"
            : "Driver Drowsiness Attention Warning (DDAW)",
        description:
          language === "fr"
            ? "Si le système DDAW détecte que le niveau d'attention du conducteur a considérablement diminué, il émettra un avertissement sonore et affichera un graphique sur le tableau de bord."
            : "If the DDAW system senses that the driver's attention level has significantly reduced, it will sound an audible warning and display a graphic on the instrument cluster.",
        video: `${SAFETY_MEDIA_BASE}/20250908115500168_DNc84H.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908115500044_x5EjM8.jpg`,
      },
      {
        id: 8,
        title:
          language === "fr"
            ? "Avertissement de Départ de Voie (LDW) / Assistance de Centrage de Maintien de Voie (CLKA)"
            : "Lane Departure Warning (LDW) / Centering Lane Keeping Assist (CLKA)",
        description:
          language === "fr"
            ? "Le LDW/CLKA utilise une caméra avant pour surveiller les marqueurs de voie peints sur la route. Il corrige automatiquement la direction assistée électrique pour maintenir le véhicule dans la voie prévue."
            : "LDW/CLKA uses a front camera to monitor the painted lane markers on the road. It automatically corrects the electric power steering to keep the vehicle within the intended lane.",
        video: `${SAFETY_MEDIA_BASE}/20250908115545575_Tryl8z.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908115545471_R5IsFq.jpg`,
      },
      {
        id: 9,
        title:
          language === "fr"
            ? "Avertissement de Collision Arrière (RCW)"
            : "Rear Collision Warning (RCW)",
        description:
          language === "fr"
            ? "Lorsqu'une collision potentielle avec un véhicule approchant par l'arrière est détectée à l'arrêt ou à basse vitesse, le RCW alerte le conducteur par des avertissements visuels et sonores."
            : "When a potential collision with an approaching vehicle from the rear is detected while the vehicle is stopped or moving at low speed, RCW alerts the driver through visual and audible warnings to help prevent accidents.",
        video: `${SAFETY_MEDIA_BASE}/20250908115649815_qX9lr7.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908115649621_hlWmqB.jpg`,
      },
    ],
    [language]
  );

  // ESC System Carousel Data (KG Mobility 2000003000100090004)
  const escCarouselData = React.useMemo(
    () => [
      {
        id: 0,
        title:
          language === "fr"
            ? "Contrôle de Descente de Colline (HDC)"
            : "Hill Descent Control (HDC)",
        description:
          language === "fr"
            ? "Lors de la descente d'une pente à basse vitesse, le HDC applique automatiquement les freins pour maintenir une vitesse constante sans le contrôle du conducteur."
            : "When descending a slope at a low speed, HDC automatically applies the brakes to maintain a constant speed without the driver's control.",
        video: `${SAFETY_MEDIA_BASE}/20250908121009548_KMSiD8.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908121009378_Y5kUAG.jpg`,
      },
      {
        id: 1,
        title:
          language === "fr"
            ? "Système d'Assistance au Freinage (BAS)"
            : "Brake Assist System (BAS)",
        description:
          language === "fr"
            ? "Le BAS applique une force maximale sur les freins lorsque le conducteur panique et qu'un freinage soudain est détecté, réduisant considérablement la distance de freinage dans les situations d'urgence."
            : "BAS applies additional force onto the brakes when the driver panics and sudden braking is detected, significantly reducing braking distance in emergencies.",
        video: `${SAFETY_MEDIA_BASE}/20250908121121828_hrr5jN.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908121121722_AN6NfF.jpg`,
      },
      {
        id: 2,
        title:
          language === "fr"
            ? "Protection Active contre le Renversement (ARP)"
            : "Active Roll-over Protection (ARP)",
        description:
          language === "fr"
            ? "L'ARP aide à maintenir une posture stable du véhicule en priorisant le contrôle du système lorsque les conditions de conduite deviennent très instables."
            : "ARP assists in maintaining a stable vehicle posture by prioritizing system control when driving conditions become highly unstable.",
        video: `${SAFETY_MEDIA_BASE}/20250908121230062_05tJNt.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908121229847_bEXKJ6.jpg`,
      },
      {
        id: 3,
        title:
          language === "fr"
            ? "Assistance au Démarrage en Côte (HSA)"
            : "Hill Start Assist (HSA)",
        description:
          language === "fr"
            ? "Le HSA aide à prévenir le recul lorsque le conducteur relâche la pédale de frein sur une pente et que le véhicule commence à se déplacer le long d'une inclinaison en maintenant un certain niveau de pression de frein pendant 2~3 secondes."
            : "HSA helps prevent roll-back when the driver releases the brake pedal on a slope and the vehicle begins to travel along an incline by maintaining a certain level of brake pressure for 2~3 seconds.",
        video: `${SAFETY_MEDIA_BASE}/20250908121317350_3QhFTv.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908121317217_UzQNp5.jpg`,
      },
      {
        id: 4,
        title:
          language === "fr"
            ? "Signal d'Arrêt d'Urgence (ESS)"
            : "Emergency Stop Signal (ESS)",
        description:
          language === "fr"
            ? "L'ESS fait clignoter les feux de freinage ou les feux de détresse pour avertir les conducteurs qui suivent lorsqu'un freinage soudain se produit ou lorsque l'ABS est activé."
            : "ESS flashes the brake lights or hazard lights to warn trailing drivers when suddenly braking or when ABS is activated.",
        video: `${SAFETY_MEDIA_BASE}/20250908121409451_PcKJGa.mp4`,
        poster: `${SAFETY_MEDIA_BASE}/20250908121409323_4alTku.jpg`,
      },
    ],
    [language]
  );

  // Additional Safety Features Carousel Data (KG Mobility 2000003000100090004)
  const additionalSafetyCarouselData = React.useMemo(
    () => [
      {
        id: 0,
        title:
          language === "fr"
            ? "Système de Surveillance de la Pression des Pneus (TPMS)"
            : "Tyre Pressure Monitoring System (TPMS)",
        description: "",
        image: `${SAFETY_MEDIA_BASE}/20250908135755677_Z1Eu7n.jpg`,
      },
      {
        id: 1,
        title:
          language === "fr"
            ? "Fixation de Siège Enfant (ISO-FIX)"
            : "Child seat anchorage (ISO-FIX)",
        description: "",
        image: `${SAFETY_MEDIA_BASE}/20250908135812721_VJNv9a.jpg`,
      },
    ],
    [language]
  );

  // Seating Configurations Carousel Data
  const seatingConfigCarouselData = React.useMemo(
    () => [
      {
        id: 0,
        title:
          language === "fr"
            ? "100% plié (703 litres)"
            : "100% folded (703 litres)",
        description: "",
        image: `${CONVENIENCE_MEDIA_BASE}/20250908144202878_X9CgqK.jpg`,
      },
      {
        id: 1,
        title:
          language === "fr"
            ? "2ème rangée 40% plié (1 181 litres)"
            : "2nd row 40% folded (1,181 litres)",
        description: "",
        image: `${CONVENIENCE_MEDIA_BASE}/20250908144228933_XrksiY.jpg`,
      },
      {
        id: 2,
        title:
          language === "fr"
            ? "2ème rangée 60% plié (1 320 litres)"
            : "2nd row 60% folded (1,320 litres)",
        description: "",
        image: `${CONVENIENCE_MEDIA_BASE}/20250908144246950_GWnroR.jpg`,
      },
    ],
    [language]
  );

  // More Features Carousel Data
  const moreFeaturesCarouselData = React.useMemo(
    () => [
      {
        id: 0,
        title:
          language === "fr"
            ? "Hayon électrique intelligent"
            : "Smart power tailgate",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144202878_X9CgqK.jpg`,
      },
      {
        id: 1,
        title:
          language === "fr"
            ? "Dispositif d'accès passager"
            : "Passenger's seat walk-in device",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144228933_XrksiY.jpg`,
      },
      {
        id: 2,
        title: language === "fr" ? "Bouche d'air arrière" : "Rear air vent",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144246950_GWnroR.jpg`,
      },
      {
        id: 3,
        title:
          language === "fr"
            ? "Apple CarPlay et Android Auto"
            : "Apple CarPlay & Android Auto",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144308788_cGhxZL.jpg`,
      },
      {
        id: 4,
        title:
          language === "fr"
            ? "Inclinaison 2ème rangée (Max 32.5º)"
            : "2nd-row reclining  (Max 32.5º)",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144330112_RUufvT.jpg`,
      },
      {
        id: 5,
        title:
          language === "fr" ? "Caméra avant/arrière" : "Front/rearview camera",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144347797_AArHaW.jpg`,
      },
      {
        id: 6,
        title:
          language === "fr"
            ? "Chargeur sans fil pour mobile"
            : "Wireless mobile charger",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144438470_Z50Uve.jpg`,
      },
      {
        id: 7,
        title:
          language === "fr"
            ? "2 Prises USB de type C (27W), avant et arrière"
            : "2 C type USB slots (27W), front and rear",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144505335_GysNuc.jpg`,
      },
      {
        id: 8,
        title:
          language === "fr"
            ? "Grand porte-goblets avant"
            : "Big-sized front cup holder",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144538475_Qyakyo.jpg`,
      },
      {
        id: 9,
        title:
          language === "fr"
            ? "Accoudoir et porte-goblets central arrière"
            : "Rear seat centre armrest and cup holder",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144603798_be1Vv3.jpg`,
      },
      {
        id: 10,
        title:
          language === "fr"
            ? "Poches cartes dossier avant"
            : "Front seat back map pockets",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144623865_rld9wm.jpg`,
      },
      {
        id: 11,
        title:
          language === "fr"
            ? "Essuie-glaces à détection de pluie"
            : "Rain sensing windscreen wipers",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144700593_lR0YNb.jpg`,
      },
      {
        id: 12,
        title:
          language === "fr"
            ? "Toit ouvrant électrique sécurisé"
            : "Safety powered sunroof",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144754744_TjDdX1.jpg`,
      },
      {
        id: 13,
        title:
          language === "fr"
            ? "Sièges chauffants, avant et arrière"
            : "Heated seats, front and rear",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144830137_ogtKTL.jpg`,
      },
      {
        id: 14,
        title:
          language === "fr"
            ? "Sièges avant ventilés"
            : "Ventilated front seats",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144853015_zivnBo.jpg`,
      },
      {
        id: 15,
        title:
          language === "fr"
            ? "Stores manuels 2ème rangée"
            : "2nd-row manual roller blinds",
        description: "",
        image:
          `${CONVENIENCE_MEDIA_BASE}/20250908144913729_tbolPz.jpg`,
      },
    ],
    [language]
  );

  // Keyboard navigation for carousels - Escape to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isADASCarouselOpen) {
          setIsADASCarouselOpen(false);
        }
        if (isESCCarouselOpen) {
          setIsESCCarouselOpen(false);
        }
        if (isAdditionalSafetyCarouselOpen) {
          setIsAdditionalSafetyCarouselOpen(false);
        }
        if (isSeatingConfigCarouselOpen) {
          setIsSeatingConfigCarouselOpen(false);
        }
        if (isMoreFeaturesCarouselOpen) {
          setIsMoreFeaturesCarouselOpen(false);
        }
      }
    };

    if (
      isADASCarouselOpen ||
      isESCCarouselOpen ||
      isAdditionalSafetyCarouselOpen ||
      isSeatingConfigCarouselOpen ||
      isMoreFeaturesCarouselOpen
    ) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [
    isADASCarouselOpen,
    isESCCarouselOpen,
    isAdditionalSafetyCarouselOpen,
    isSeatingConfigCarouselOpen,
    isMoreFeaturesCarouselOpen,
  ]);

  // Convenience features data
  const convenienceFeatures = [
    {
      id: 0,
      title:
        language === "fr"
          ? "Un espace pratique lors de l'exploration de la nature"
          : "A convenient space when exploring the wild",
      subtitle:
        language === "fr"
          ? "Bouton d'ouverture de hayon interne"
          : "Internal tailgate opening button",
      description:
        language === "fr"
          ? "Le hayon inclut un bouton interne qui vous permet d'ouvrir et de fermer le hayon depuis l'intérieur du véhicule, ce qui le rend pratique pour le camping en voiture."
          : "The tailgate includes an internal button that allows you to open and close the tailgate from inside the vehicle, making it convenient for camping in the car.",
      image: `${CONVENIENCE_MEDIA_BASE}/20250905114608769_yP9xXh.jpg`,
      video: `${CONVENIENCE_MEDIA_BASE}/20250905114608938_soMPil.mp4`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 1,
      title:
        language === "fr"
          ? "Surveillance des angles morts"
          : "Blind spot monitoring",
      subtitle:
        language === "fr"
          ? "Système de surveillance 3D 360°"
          : "3D 360° around view monitoring system",
      description:
        language === "fr"
          ? "Quatre caméras extérieures surveillent les manœuvres de stationnement et la conduite, offrant une vue claire et utile des zones arrière ainsi que de l'environnement au sol."
          : "Four cameras on the exterior monitor parking and driving, helpfully providing a clear view of the rear and ground areas.",
      image: `${CONVENIENCE_MEDIA_BASE}/20250910091019135_n5TBzu.jpg`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 2,
      title: language === "fr" ? "Confort de conduite" : "Driving comfort",
      subtitle:
        language === "fr"
          ? "Sièges avant réglables électriquement 8 directions"
          : "8-way power-adjustable front seats",
      description:
        language === "fr"
          ? "Doté d'un siège électrique 8 directions avec support lombaire 2 directions (pour ajuster le dossier inférieur), offrant un environnement de conduite confortable adapté aux besoins de chacun."
          : "Featuring an 8-way powered seat with 2-way lumbar support (for adjusting the lower backrest), providing a comfortable driving environment tailored to anyone's needs.",
      image: `${CONVENIENCE_MEDIA_BASE}/20250908140651579_A5kqYT.jpg`,
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 3,
      title:
        language === "fr"
          ? "Contrôle de la qualité de l'air"
          : "Air quality control",
      subtitle:
        language === "fr"
          ? "Système de climatisation automatique double zone avant"
          : "Front dual zone auto air conditioning system",
      description:
        language === "fr"
          ? "Incluant un filtre de climatisation micro, dégivrage automatique et fonctions de soufflage après pour une conduite plus confortable."
          : "Including a micro air conditioning filter, auto defogging, and after-blow functions for a more comfortable ride.",
      image: `${CONVENIENCE_MEDIA_BASE}/20250908141054841_JGWSkH.jpg`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 4,
      title: language === "fr" ? "Plus de Fonctionnalités" : "More Features",
      subtitle: language === "fr" ? "OUVRIR" : "OPEN",
      description: "",
      image: `${CONVENIENCE_MEDIA_BASE}/20250908144124381_SYG0t7.jpg`,
      bgColor: "bg-blue-600",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: true,
    },
  ];

  // Performance (Hybrid) features data – 6 cards, Supabase PERFORMANCE folder
  const performanceFeatures = [
    {
      id: 0,
      title:
        language === "fr"
          ? "94 % en mode électrique en ville"
          : "94% Electric mode in city driving",
      subtitle:
        language === "fr"
          ? "Système hybride Dual Tech"
          : "Dual Tech Hybrid system",
      description:
        language === "fr"
          ? "Moteurs doubles série-parallèle avec transmission e-DHT pour d'excellentes performances et une efficacité énergétique grâce à la charge et à la conduite électrique simultanées."
          : "Series-parallel dual motors with e-DHT transmission deliver excellent performance and fuel efficiency through simultaneous charging and electric driving.",
      image: `${PERFORMANCE_MEDIA_BASE}/20250905114853261_leHk72.jpg`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 1,
      title:
        language === "fr"
          ? "Autonomie électrique renforcée"
          : "Enhanced EV range",
      subtitle:
        language === "fr"
          ? "Système de batterie hybride optimisé"
          : "Optimal hybrid battery system",
      description:
        language === "fr"
          ? "Batterie haute tension 1,83 kWh optimisée pour l'efficacité et l'équilibre des masses, prolongeant l'autonomie en mode électrique."
          : "1.83kWh high-voltage battery optimized for efficiency and weight balance, extending EV driving range.",
      image: `${PERFORMANCE_MEDIA_BASE}/20250908145136524_yMLdiB.jpg`,
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 2,
      title:
        language === "fr"
          ? "NVH optimisé pour l'hybride"
          : "Hybrid-Optimized NVH",
      subtitle:
        language === "fr"
          ? "Plan détaillé NVH"
          : "NVH detail plan",
      description:
        language === "fr"
          ? "Matériaux absorbants dans le compartiment moteur, la couverture et les passages de roue pour réduire efficacement le bruit routier et la résonance des pneus."
          : "Sound-absorbing materials in engine room, cover, and wheel houses effectively reduce road noise and tire resonance.",
      image: `${PERFORMANCE_MEDIA_BASE}/20250908145245450_I0T1t1.jpg`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 3,
      title: language === "fr" ? "Recharge HEV" : "HEV Charging",
      subtitle:
        language === "fr"
          ? "Système de freinage régénératif"
          : "Regenerative braking system",
      description:
        language === "fr"
          ? "Réglage de la sensibilité de freinage sur trois niveaux via les palettes au volant pour récupérer l'énergie et recharger la batterie."
          : "Three-level brake sensitivity adjustment via paddle shifts efficiently recovers energy to charge the battery.",
      image: `${PERFORMANCE_MEDIA_BASE}/20250908150318343_aQmBuH.jpg`,
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 4,
      title:
        language === "fr"
          ? "Performances optimales"
          : "Optimal performance",
      subtitle:
        language === "fr"
          ? "Système de modes de conduite"
          : "Drive mode system",
      description:
        language === "fr"
          ? "Performances de conduite optimales selon le mode choisi (COMFORT/SPORT/HIVER) grâce à l'intégration de la direction et de la suspension."
          : "Providing optimal driving performance based on the selected mode (COMFORT/SPORT/WINTER) by integrating the steering and suspension systems.",
      image: `${PERFORMANCE_MEDIA_BASE}/20250908145543973_Vg1GXy.jpg`,
      bgColor: "bg-gray-800",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
    {
      id: 5,
      title: language === "fr" ? "EPB" : "EPB",
      subtitle:
        language === "fr"
          ? "Frein de stationnement électronique"
          : "Electronic Parking Brake",
      description:
        language === "fr"
          ? "Type commutateur avec maintien automatique."
          : "Toggle-switch type with auto hold.",
      image: `${PERFORMANCE_MEDIA_BASE}/20250908145626328_rRE6QR.jpg`,
      bgColor: "bg-gray-200",
      textColor: "text-white",
      subtitleColor: "text-white",
      hasOpenButton: false,
    },
  ];

  // Specification images
  const specImages = [
    {
      id: 0,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section9/20250204095751200_nOsk1W.jpg",
      alt: language === "fr" ? "Vue de face du Torres" : "Torres front view",
    },
    {
      id: 1,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section9/20250204095759042_oQPF7t.jpg",
      alt: language === "fr" ? "Vue latérale du Torres" : "Torres side view",
    },
    {
      id: 2,
      src: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section9/20250224134135542_yPGjdl.jpg",
      alt: language === "fr" ? "Vue arrière du Torres" : "Torres rear view",
    },
  ];

  // Specification accordion data
  const specAccordions: Array<{
    id: number;
    title: string;
    content: {
      dimensions?: Array<{ label: string; value: string }>;
      engine?: Array<{ label: string; value: string }>;
      transmission?: Array<{ label: string; value: string }>;
      efficiency?: Array<{ label: string; value: string }>;
      tyres?: Array<{
        maker: string;
        size: string;
        productSheet: string;
        tyreLabel: string;
      }>;
    };
  }> = [
    {
      id: 0,
      title: language === "fr" ? "DIMENSIONS" : "DIMENSIONS",
      content: {
        dimensions: [
          {
            label: language === "fr" ? "Longueur Totale" : "Overall Length",
            value: "4,200mm",
          },
          {
            label: language === "fr" ? "Largeur Totale" : "Overall Width",
            value: "1,560mm",
          },
          {
            label: language === "fr" ? "Hauteur Totale" : "Overall Height",
            value: "1,613mm",
          },
          {
            label: language === "fr" ? "Empattement" : "Wheelbase",
            value: "2,600mm",
          },
          {
            label: language === "fr" ? "Garde au Sol" : "Ground Clearance",
            value: "190mm",
          },
        ],
      },
    },
    {
      id: 1,
      title: language === "fr" ? "GROUPE MOTOPROPULSEUR" : "POWERTRAIN",
      content: {
        engine: [
          {
            label: language === "fr" ? "Type de Moteur" : "Engine Type",
            value: "1.5L GDI Turbo",
          },
          {
            label: language === "fr" ? "Cylindrée" : "Displacement",
            value: "1,497cc",
          },
          {
            label: language === "fr" ? "Puissance Max" : "Max Power",
            value: "160ps @ 5,500rpm",
          },
          {
            label: language === "fr" ? "Couple Max" : "Max Torque",
            value: "25.5kgf·m @ 1,500-4,000rpm",
          },
        ],
        transmission: [
          {
            label: language === "fr" ? "Transmission" : "Transmission",
            value: "6-Speed Automatic",
          },
          {
            label: language === "fr" ? "Type de Transmission" : "Drive Type",
            value: "FWD / AWD",
          },
        ],
      },
    },
    {
      id: 2,
      title: language === "fr" ? "EFFICACITÉ ÉNERGÉTIQUE" : "FUEL EFFICIENCY",
      content: {
        efficiency: [
          { label: language === "fr" ? "Ville" : "City", value: "12.4 km/L" },
          {
            label: language === "fr" ? "Autoroute" : "Highway",
            value: "15.2 km/L",
          },
          {
            label: language === "fr" ? "Combiné" : "Combined",
            value: "13.5 km/L",
          },
          {
            label: language === "fr" ? "Émissions CO2" : "CO2 Emissions",
            value: "119 g/km",
          },
        ],
      },
    },
    {
      id: 3,
      title:
        language === "fr" ? "INFORMATIONS SUR LES PNEUS" : "TYRE INFORMATION",
      content: {
        tyres: [
          {
            maker: "KH",
            size: "205/60R16 SUMMER",
            productSheet:
              "/assets/Modelspage/Tivoli/section9/KH_16_SUMMER_PIS.pdf",
            tyreLabel: "/assets/Modelspage/Tivoli/section9/KH_16_SUMMER_TL.pdf",
          },
          {
            maker: "NX",
            size: "205/65R16",
            productSheet: "/assets/Modelspage/Tivoli/section9/NX_16_PIS.pdf",
            tyreLabel: "/assets/Modelspage/Tivoli/section9/NX_16_TL.pdf",
          },
          {
            maker: "KH",
            size: "215/50R18",
            productSheet: "/assets/Modelspage/Tivoli/section9/KH_18_PIS.pdf",
            tyreLabel: "/assets/Modelspage/Tivoli/section9/KH_18_TL.pdf",
          },
        ],
      },
    },
  ];

  // Accessory data
  const exteriorAccessories = [
    {
      id: 0,
      name:
        language === "fr" ? "Garniture d'Arche de Roue" : "Wheel Arch Garnish",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/section10/exterior/20250124165250010_VtR9QF.jpg",
      description:
        language === "fr"
          ? "Garniture élégante pour protéger et embellir les arches de roues."
          : "Elegant garnish to protect and enhance wheel arches.",
    },
    {
      id: 1,
      name: language === "fr" ? "Marches Latérales" : "Side Steps",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/section10/exterior/20250124165303194_HE4xku.jpg",
      description:
        language === "fr"
          ? "Marches latérales pratiques pour un accès facile au véhicule."
          : "Practical side steps for easy vehicle access.",
    },
    {
      id: 2,
      name: language === "fr" ? "Rangement Pilier C" : "C-Pillar Storage",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/section10/exterior/20250124165316109_Wy3UXr.jpg",
      description:
        language === "fr"
          ? "Rangement pratique intégré dans le pilier C pour une organisation optimale."
          : "Practical storage integrated into the C-pillar for optimal organization.",
    },
  ];

  const interiorAccessories = [
    {
      id: 0,
      name:
        language === "fr" ? "Lampe de Projection de Porte" : "Door Spot Lamp",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/section10/20250124165543199_QuMGSc.jpg",
      description:
        language === "fr"
          ? "Lampe de projection élégante qui illumine le sol à l'ouverture des portes."
          : "Elegant projection lamp that illuminates the ground when doors are opened.",
    },
    {
      id: 1,
      name: language === "fr" ? "Pédales Sport Alliage" : "Alloy Sports Pedal",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/section10/20250124165556783_Kbs0wW.jpg",
      description:
        language === "fr"
          ? "Pédales sport en alliage pour une expérience de conduite plus dynamique."
          : "Alloy sports pedals for a more dynamic driving experience.",
    },
    {
      id: 2,
      name: language === "fr" ? "Tapis d'Air" : "Air Mat",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/section10/20250124165609867_XEgxij.jpg",
      description:
        language === "fr"
          ? "Tapis d'air confortable pour une protection optimale du sol du véhicule."
          : "Comfortable air mat for optimal vehicle floor protection.",
    },
    {
      id: 3,
      name: language === "fr" ? "Rideau Multi-Fonction" : "Multi Curtain",
      image:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/section10/20250124165622778_a2SkrS.jpg",
      description:
        language === "fr"
          ? "Rideau multi-fonction pour une intimité et une protection solaire optimales."
          : "Multi-function curtain for optimal privacy and sun protection.",
    },
  ];

  // Desktop positions (design-detail style: top %, left %)
  const carHotspotsDesktop = [
    {
      id: "headlight",
      position: { x: "79%", y: "35%" },
      title:
        language === "fr"
          ? "Phares LED Avancés"
          : "DRL integrated full LED projection headlamps",
      description: "Head lights with outer lens clean-type design",
    },
    {
      id: "grille",
      position: { x: "34%", y: "23%" },
      title: "Signature Grille",
      description: "Distinctive front grille design",
    },
    {
      id: "foglight",
      position: { x: "23%", y: "22%" },
      title: "Fog Lights",
      description: "Enhanced visibility in all conditions",
    },
    {
      id: "wheel",
      position: { x: "31%", y: "65%" },
      title: "Alloy Wheels",
      description: "Sporty multi-spoke design",
    },
    {
      id: "roof",
      position: { x: "42%", y: "10%" },
      title: "Roof Rails",
      description: "Functional roof rail system",
    },
  ];

  // Mobile positions (same as desktop for consistent layout)
  const carHotspotsMobile = [
    {
      id: "headlight",
      position: { x: "79%", y: "35%" },
      title:
        language === "fr"
          ? "Phares LED Avancés"
          : "DRL integrated full LED projection headlamps",
      description: "Head lights with outer lens clean-type design",
    },
    {
      id: "grille",
      position: { x: "34%", y: "23%" },
      title: "Signature Grille",
      description: "Distinctive front grille design",
    },
    {
      id: "foglight",
      position: { x: "23%", y: "22%" },
      title: "Fog Lights",
      description: "Enhanced visibility in all conditions",
    },
    {
      id: "wheel",
      position: { x: "31%", y: "65%" },
      title: "Alloy Wheels",
      description: "Sporty multi-spoke design",
    },
    {
      id: "roof",
      position: { x: "42%", y: "10%" },
      title: "Roof Rails",
      description: "Functional roof rail system",
    },
  ];

  // Use mobile or desktop positions based on screen size
  const carHotspots = isMobile ? carHotspotsMobile : carHotspotsDesktop;

  // Rear view hotspots (positions relative to rear image - % so they scale with image)
  const rearHotspots = [
    { id: "rear_1", position: { x: "43%", y: "41%" }, title: language === "fr" ? "Feu arrière combiné LED" : "LED rear combination lamp", description: language === "fr" ? "Voir cette partie en détail" : "View this part in detail" },
    { id: "rear_2", position: { x: "60%", y: "11%" }, title: language === "fr" ? "Barres de toit utilitaires" : "Utility roof rail", description: language === "fr" ? "Pour fixer facilement coffres de toit et tentes de toit." : "For you to conveniently attach outdoor roof boxes and rooftop tents." },
    { id: "rear_3", position: { x: "53%", y: "19%" }, title: language === "fr" ? "Garniture de montant C argentée" : "Silver C-pillar garnish", description: language === "fr" ? "La garniture argent satin du montant C met en valeur le design iconique. (S'applique aux modèles couleur 1 ton.)" : "The satin silver C-pillar garnish enhances the iconic design to make it stand out more. (Applies to 1 tone color models.)" },
    { id: "rear_4", position: { x: "35%", y: "38%" }, title: language === "fr" ? "Poignée de porte et bouton d'ouverture intérieur" : "Door latch & Interior door open button", description: language === "fr" ? "Voir cette partie en détail" : "View this part in detail" },
    { id: "rear_5", position: { x: "74%", y: "65%" }, title: language === "fr" ? "Porte à joint d'étanchéité" : "Clean seal door", description: language === "fr" ? "Voir cette partie en détail" : "View this part in detail" },
  ];

  // Hotspot content with media and descriptions
  const hotspotContent = [
    {
      id: "headlight",
      content: {
        title:
          language === "fr"
            ? "Phares LED Avancés"
            : "DRL integrated full LED projection headlamps",
        video:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/btns/ledvideo.mp4",
        texts: [
          language === "fr"
            ? "Les phares avec un design de lentille externe de type propre transmettent le caractère iconique unique au Torres."
            : "The head lights with an outer lens clean-type design convey the iconic character unique to the Torres.",
        ],
      },
    },
    {
      id: "grille",
      content: {
        title: language === "fr" ? "Détail du Capot" : "Bonnet detailing",
        images: [
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/buttonsexterior/btn2/20250124145154236_sRMx4G.jpg",
        ],
        texts: [
          language === "fr"
            ? "Supportant diverses activités de plein air - peut être utilisé pour installer des GoPros, des équipements de protection de véhicule, des bâches et plus encore."
            : "Supporting various outdoor activities - can be used to install GoPros, vehicle protection gear, tarps and more.",
        ],
      },
    },
    {
      id: "foglight",
      content: {
        title:
          language === "fr"
            ? "Rétroviseurs Extérieurs Style Drapeau"
            : "Flag style exterior rearview mirrors",
        video:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/buttonsexterior/btn3/20250124145248905_OB2qdt.mp4",
        texts: [
          language === "fr"
            ? "Incluant les feux de clignotement LED, pliage automatique et fonctions d'ajustement électrique"
            : "Including LED turn signal lamps, auto-folding, and power adjustment features",
        ],
      },
    },
    {
      id: "wheel",
      content: {
        title: language === "fr" ? "Jantes" : "Wheels",
        images: [
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/btns/retroviseur1.jpg",
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/btns/retroviseur2.jpg",
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/btns/retroviseur3.jpg",
        ],
        texts: [
          language === "fr"
            ? '20" Jantes finition diamant avec pneus 245/45R'
            : '20" Diamond-cut finished wheels with 245/45R tyres',
          language === "fr"
            ? '18" Jantes finition diamant avec pneus 225/60R'
            : '18" Diamond-cut finished wheels with 225/60R tyres',
          language === "fr"
            ? '17" Jantes alliage avec pneus 225/60R'
            : '17" Alloy wheels with 225/60R tyres',
        ],
      },
    },
    {
      id: "roof",
      content: {
        title:
          language === "fr"
            ? "Toit ouvrant panoramique"
            : "Panoramic sunroof",
        images: [
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/btns/btn1.jpg",
        ],
        texts: [
          language === "fr"
            ? "Permet un éclairage et une ventilation intérieurs faciles, pour une sensation de fraîcheur et d'ouverture."
            : "Allowing for easy indoor lighting and ventilation, will provide a cool, open feeling.",
        ],
      },
    },
    // Rear view hotspot content
    {
      id: "rear_1",
      content: {
        title: language === "fr" ? "Feu arrière combiné LED" : "LED rear combination lamp",
        video: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/btns/back/ledback.mp4",
        texts: [
          language === "fr"
            ? "Le feu arrière distinctif, inspiré des quatre trigrammes du drapeau coréen (Geon, Gon, Gam et Ri), complète un design arrière équilibré."
            : "The distinctive rear lamp, inspired by the Korean flag's four trigrams (Geon, Gon, Gam, and Ri), completes a balanced rear design.",
        ],
      },
    },
    { id: "rear_2", content: { title: language === "fr" ? "Barres de toit utilitaires" : "Utility roof rail", images: ["https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/btns/back/roofback.jpg"], texts: [language === "fr" ? "Pour fixer facilement coffres de toit et tentes de toit." : "For you to conveniently attach outdoor roof boxes and rooftop tents."] } },
    { id: "rear_3", content: { title: language === "fr" ? "Garniture de montant C argentée" : "Silver C-pillar garnish", images: ["https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/btns/back/1.jpg", "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/btns/back/2.jpg"], texts: [language === "fr" ? "La garniture argent satin du montant C met en valeur le design iconique pour le faire ressortir. (S'applique aux modèles couleur 1 ton.)" : "The satin silver C-pillar garnish enhances the iconic design to make it stand out more. (Applies to 1 tone color models.)"] } },
    {
      id: "rear_4",
      content: {
        title: language === "fr" ? "Poignée de porte et bouton d'ouverture intérieur" : "Door latch & Interior door open button",
        video: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/btns/back/doorvideo.mp4",
        texts: [
          language === "fr"
            ? "Équipé d'une poignée de porte raffinée et d'un bouton intérieur pour une utilisation pratique du hayon depuis l'habitacle."
            : "Equipped with a refined door latch and interior button for convenient tailgate operation from inside the cabin.",
        ],
      },
    },
    { id: "rear_5", content: { title: language === "fr" ? "Porte à joint d'étanchéité" : "Clean seal door", images: ["https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/btns/back/bab.jpg"], texts: [language === "fr" ? "La couverture étendue de la portière protège les vêtements de la saleté à l'entrée et à la sortie du véhicule." : "Extended door coverage protects clothing from dirt when entering and exiting the vehicle."] } },
  ];

  const getHotspotContent = () => {
    if (!selectedHotspot) return null;
    const hotspot = hotspotContent.find((h) => h.id === selectedHotspot);
    return hotspot?.content || null;
  };

  const handleHotspotClick = (hotspotId: string) => {
    setSelectedHotspot(hotspotId);
    setIsSideMenuOpen(true);
    setCurrentHotspotImage(0);
  };

  // Interior hotspots data
  const interiorHotspots = [
    {
      id: "dashboard",
      position: { x: "40%", y: "38%" },
      title:
        language === "fr" ? "Tableau de bord panoramique" : "Panoramic display",
      description:
        language === "fr"
          ? 'Cluster numérique 12,3" et système AVNT'
          : '12.3" digital cluster and AVNT system',
      content: {
        title:
          language === "fr"
            ? "Tableau de bord panoramique"
            : "Panoramic display",
        subtitle:
          language === "fr"
            ? 'Cluster numérique 12,3" et système AVNT'
            : '12.3" digital cluster and AVNT system',
        video:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/btnsinterior/btn1/20250210093007663_gB1Jyo.mp4",
        texts: [
          language === "fr"
            ? 'Le tableau de bord numérique de 12,3" et le système AVNT fonctionnent comme un panneau de commande intégré, offrant un contrôle simple et intuitif de nombreuses informations, notamment les données de conduite.'
            : 'The 12.3" digital cluster and AVNT system function as an integrated control panel, allowing easy and convenient control of various information, including driving data.',
        ],
      },
    },
    {
      id: "mood-lighting",
      position: { x: "62%", y: "43%" },
      title: language === "fr" ? "Éclairage d'ambiance" : "Mood lighting",
      description:
        language === "fr"
          ? "Éclairage indirect personnalisable"
          : "Customizable indirect lighting",
      content: {
        title: language === "fr" ? "Éclairage d'ambiance" : "Mood lighting",
        subtitle:
          language === "fr"
            ? "Éclairage indirect personnalisable"
            : "Customizable indirect lighting",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/20250203180937116_B1zkON.jpg",
        texts: [
          language === "fr"
            ? "L'éclairage indirect de la planche de bord, de la console centrale et des panneaux de porte est personnalisable avec jusqu'à 32 combinaisons de couleurs (6 couleurs par défaut)"
            : "The indirect lighting on the IP front, centre console, and door trims can be customized with up to 32 color combinations (with a default of 6 colors).",
        ],
      },
    },
    {
      id: "gear-selector",
      position: { x: "46%", y: "73%" },
      title:
        language === "fr"
          ? "Sélecteur de Vitesse"
          : "'Shift By Wire' Toggle switch",
      description:
        language === "fr"
          ? "Le sélecteur de vitesses moderne offre un contrôle précis de la transmission pour une conduite fluide et efficace."
          : "Including a malfunction prevention safety system, enhancing operational convenience while also ensuring ample storage space.",
      content: {
        title:
          language === "fr"
            ? "Sélecteur de Vitesse"
            : "'Shift By Wire' Toggle switch",
        subtitle:
          language === "fr"
            ? "Le sélecteur de vitesses moderne offre un contrôle précis de la transmission pour une conduite fluide et efficace."
            : "Including a malfunction prevention safety system, enhancing operational convenience while also ensuring ample storage space.",
        image: "/20250203180906900_ipNGJH.jpg",
        texts: [
          language === "fr"
            ? "Le sélecteur de vitesses moderne offre un contrôle précis de la transmission pour une conduite fluide et efficace."
            : "Including a malfunction prevention safety system, enhancing operational convenience while also ensuring ample storage space.",
        ],
      },
    },
    {
      id: "centre-tray",
      position: { x: "50%", y: "75%" },
      title: language === "fr" ? "Console centrale" : "Centre under tray",
      description:
        language === "fr"
          ? "Idéal pour ranger facilement vos affaires personnelles comme les sacs et les parapluies pliants."
          : "Easily store personal items such as bags and folding umbrellas.",
      content: {
        title: language === "fr" ? "Console centrale" : "Centre under tray",
        subtitle:
          language === "fr"
            ? "Idéal pour ranger facilement vos affaires personnelles comme les sacs et les parapluies pliants."
            : "Easily store personal items such as bags and folding umbrellas.",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/btnsinterior/btn4/20250124153631339_lNWy1V.jpg",
        texts: [
          language === "fr"
            ? "Idéal pour ranger facilement vos affaires personnelles comme les sacs et les parapluies pliants."
            : "Easily store personal items such as bags and folding umbrellas.",
        ],
      },
    },
    {
      id: "after-blow",
      position: { x: "73%", y: "36%" },
      title:
        language === "fr"
          ? "Mode Après-Soufflage"
          : "After-blow mode(Air conditioning dehumidification)",
      description:
        language === "fr"
          ? "Déshumidification de la climatisation"
          : "Air conditioning dehumidification",
      content: {
        title:
          language === "fr"
            ? "Mode Après-Soufflage"
            : "After-blow mode(Air conditioning dehumidification)",
        subtitle:
          language === "fr"
            ? "Déshumidification de la climatisation"
            : "Air conditioning dehumidification",
        image:
          "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/20250210153918931_EmNlrb.jpg",
        texts: [
          language === "fr"
            ? "Le système de climatisation sèche automatiquement l'humidité dans tout l'intérieur, y compris l'évaporateur, pour minimiser les facteurs qui causent des odeurs désagréables à l'intérieur du véhicule."
            : "The air conditioning system automatically dries the moisture throughout the interior, including the evaporator, to minimize the factors that cause unpleasant odors inside the vehicle.",
        ],
      },
    },
  ];

  // Interior hotspot handlers
  const handleInteriorHotspotClick = (hotspotId: string) => {
    console.log("Interior hotspot clicked:", hotspotId);
    setSelectedInteriorHotspot(hotspotId);
    setCurrentInteriorHotspotImage(0);
    setIsInteriorSideMenuOpen(true);
    console.log("Setting sidebar open, hotspot:", hotspotId);
  };

  const closeInteriorSideMenu = () => {
    setIsInteriorSideMenuOpen(false);
    setSelectedInteriorHotspot(null);
  };

  const getInteriorHotspotContent = () => {
    console.log(
      "getInteriorHotspotContent called, selectedHotspot:",
      selectedInteriorHotspot
    );
    if (!selectedInteriorHotspot) {
      console.log("No selected hotspot");
      return null;
    }
    const hotspot = interiorHotspots.find(
      (h) => h.id === selectedInteriorHotspot
    );
    console.log("Found hotspot:", hotspot);
    console.log("Hotspot content:", hotspot?.content);
    return hotspot?.content || null;
  };

  const nextInteriorHotspotImage = () => {
    const content = getInteriorHotspotContent();
    if (content) {
      const videoCount = "video" in content && content.video ? 1 : 0;
      const imagesCount =
        "images" in content && Array.isArray(content.images)
          ? content.images.length
          : 0;
      const imageCount = "image" in content && content.image ? 1 : 0;
      const totalItems = videoCount + imagesCount + imageCount;
      setCurrentInteriorHotspotImage((prev) => (prev + 1) % totalItems);
    }
  };

  const prevInteriorHotspotImage = () => {
    const content = getInteriorHotspotContent();
    if (content) {
      const videoCount = "video" in content && content.video ? 1 : 0;
      const imagesCount =
        "images" in content && Array.isArray(content.images)
          ? content.images.length
          : 0;
      const imageCount = "image" in content && content.image ? 1 : 0;
      const totalItems = videoCount + imagesCount + imageCount;
      setCurrentInteriorHotspotImage((prev) =>
        prev === 0 ? totalItems - 1 : prev - 1
      );
    }
  };

  const carColors = [
    {
      id: 0,
      name: "Dandy Blue",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/blue.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/blue.jpg", // Same image for both tones
      colorSwatch: "#2E5B8A",
      hasTwoTones: false, // This color only has one tone
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/dandyblue/img${i + 1}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/dandyblue/img${i + 1}.png`
        ),
      },
    },
    {
      id: 1,
      name: "Forest Green",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/green.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/green.jpg",
      colorSwatch: "#228B22",
      hasTwoTones: false,
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/forestgreen/img${i + 1}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/forestgreen/img${i + 1}.png`
        ),
      },
    },
    {
      id: 2,
      name: "Grand White",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/white.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/white.jpg",
      colorSwatch: "#FFFFFF",
      hasTwoTones: false,
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/white/img${i + 1}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/white/img${i + 1}.png`
        ),
      },
    },
    {
      id: 3,
      name: "Iron Metal",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/metal.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/metal.jpg",
      colorSwatch: "#6B6B6B",
      hasTwoTones: false,
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/iron/img${i + 1}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/iron/img${i + 1}.png`
        ),
      },
    },
    {
      id: 4,
      name: "Latte Greige",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/late.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/late.jpg",
      colorSwatch: "#D4C4A8",
      hasTwoTones: false,
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/LatteGreige/img${i + 1}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/LatteGreige/img${i + 1}.png`
        ),
      },
    },
    {
      id: 5,
      name: "Space Black",
      oneTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/black.jpg",
      twoTone:
        "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/colorpalette/black.jpg", // Using same image for both tones since we only have 1-tone
      colorSwatch: "#1A1A1A",
      hasTwoTones: false, // This color only has one tone
      vrImages: {
        oneTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/black/img${i + 1}.png`
        ),
        twoTone: Array.from(
          { length: 36 },
          (_, i) =>
            `https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/black/img${i + 1}.png`
        ),
      },
    },
  ];

  // Handle color selection with automatic tone mode adjustment
  const handleColorSelection = (colorId: number) => {
    setSelectedColor(colorId);
    const color = carColors[colorId];
    // If color only has one tone, automatically set to 1 TONE
    if (!color.hasTwoTones) {
      setToneMode("1 TONE");
    }
  };

  // Get current VR images based on selected color and tone
  const getCurrentVrImages = () => {
    const color = carColors[selectedColor];
    return toneMode === "1 TONE"
      ? color.vrImages.oneTone
      : color.vrImages.twoTone;
  };

  // Reset frame when color or tone changes
  useEffect(() => {
    setCurrentFrame(0);
    setTargetFrame(0);

    // Debug color selection
    const currentColor = carColors[selectedColor];
    console.log(`Selected color: ${currentColor.name}, Tone: ${toneMode}`);
    console.log(
      `Image source: ${
        toneMode === "1 TONE" ? currentColor.oneTone : currentColor.twoTone
      }`
    );
  }, [selectedColor, toneMode]);

  // Preload all VR images to prevent glitches during rotation
  useEffect(() => {
    const vrImages = getCurrentVrImages();
    if (!vrImages || vrImages.length === 0) return;

    // Preload all images in the current set
    const imagePromises = vrImages.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
        // Set crossOrigin for external images
        if (src.startsWith("http")) {
          img.crossOrigin = "anonymous";
        }
      });
    });

    // Preload images in background (don't block UI)
    Promise.all(imagePromises).catch((error) => {
      console.warn("Some VR images failed to preload:", error);
    });
  }, [selectedColor, toneMode]);

  // ============================================================================
  // HIGH-PERFORMANCE 360° VR ROTATION SYSTEM
  // ============================================================================

  // Frame interpolation with easing for smooth transitions
  const interpolateFrame = (
    from: number,
    to: number,
    progress: number
  ): number => {
    // Easing function for smooth interpolation (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    return from + (to - from) * easeOut;
  };

  // Normalize frame to stay within bounds with smooth wrapping
  const normalizeFrame = (frame: number): number => {
    return ((frame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
  };

  // No animation loop needed - instant updates only

  // ============================================================================
  // UNIFIED POINTER EVENTS (Mouse + Touch)
  // ============================================================================

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart(e.clientX);
    setLastDragX(e.clientX);
    setLastDragTime(Date.now());
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const currentTime = Date.now();
    const deltaTime = currentTime - lastDragTime;
    const currentX = e.clientX;
    const deltaX = currentX - lastDragX; // Use incremental movement, not total distance

    // Apply deadzone - ignore very small movements
    if (Math.abs(deltaX) < DEADZONE_PIXELS) return;

    // No velocity calculation needed for instant updates

    // Update target frame with precise sensitivity - use incremental movement
    const frameDelta = deltaX * SENSITIVITY;
    const newFrame = normalizeFrame(targetFrame + frameDelta);
    setTargetFrame(newFrame);

    setLastDragX(currentX); // Update last position for next incremental calculation
    setLastDragTime(currentTime);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    setIsDragging(false);
  };

  // ============================================================================
  // LEGACY MOUSE/TOUCH EVENTS (Fallback for older browsers)
  // ============================================================================

  const handleMouseDown = (e: React.MouseEvent) => {
    handlePointerDown(e as any);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handlePointerMove(e as any);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    handlePointerUp(e as any);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const touch = e.touches[0] || e.changedTouches[0];
    if (touch) {
      const clientX = touch.clientX;
      setDragStart(clientX);
      setLastDragX(clientX);
      setLastDragTime(Date.now());
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();

    const touch = e.touches[0] || e.changedTouches[0];
    if (!touch) return;

    const currentTime = Date.now();
    const currentX = touch.clientX;
    const deltaX = currentX - lastDragX; // Use incremental movement, not total distance

    // Apply deadzone - ignore very small movements
    if (Math.abs(deltaX) < DEADZONE_PIXELS) return;

    // Update target frame with precise sensitivity - use incremental movement
    const frameDelta = deltaX * SENSITIVITY;
    const newFrame = normalizeFrame(targetFrame + frameDelta);
    setTargetFrame(newFrame);

    setLastDragX(currentX); // Update last position for next incremental calculation
    setLastDragTime(currentTime);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // ============================================================================
  // SMOOTH FRAME INTERPOLATION WITH EASING
  // ============================================================================

  // Smooth animation loop using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      // Get current frame from ref to avoid dependency issues
      const current = currentFrameRef.current;

      // Smooth interpolation speed (frames per second)
      const interpolationSpeed = isDragging ? 0.25 : 0.12; // Faster when dragging, slower when not

      // Calculate the difference between current and target
      let diff = targetFrame - current;

      // Handle wrapping (shortest path around the circle)
      if (Math.abs(diff) > FRAME_COUNT / 2) {
        diff = diff > 0 ? diff - FRAME_COUNT : diff + FRAME_COUNT;
      }

      // If difference is very small, snap to target
      if (Math.abs(diff) < 0.01) {
        currentFrameRef.current = targetFrame;
        setCurrentFrame(targetFrame);
      } else {
        // Smooth interpolation with easing
        const step = diff * interpolationSpeed;
        const newFrame = normalizeFrame(current + step);
        currentFrameRef.current = newFrame;
        setCurrentFrame(newFrame);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [targetFrame, isDragging]);

  // Update ref when currentFrame changes externally
  useEffect(() => {
    currentFrameRef.current = currentFrame;
  }, [currentFrame]);

  // Navigation functions for safety carousel
  const nextSafetyCard = () => {
    // Close carousels if open when navigating
    if (isADASCarouselOpen) {
      setIsADASCarouselOpen(false);
    }
    if (isESCCarouselOpen) {
      setIsESCCarouselOpen(false);
    }
    if (isAdditionalSafetyCarouselOpen) {
      setIsAdditionalSafetyCarouselOpen(false);
    }
    setCurrentSafetyCard((prev) =>
      Math.min(prev + 1, safetyFeatures.length - 3)
    );
  };

  const prevSafetyCard = () => {
    // Close carousels if open when navigating
    if (isADASCarouselOpen) {
      setIsADASCarouselOpen(false);
    }
    if (isESCCarouselOpen) {
      setIsESCCarouselOpen(false);
    }
    if (isAdditionalSafetyCarouselOpen) {
      setIsAdditionalSafetyCarouselOpen(false);
    }
    setCurrentSafetyCard((prev) => Math.max(prev - 1, 0));
  };

  // Video play function
  const toggleVideo = (videoSrc: string) => {
    if (playingVideo === videoSrc && videoPlaying) {
      // Stop video
      setVideoPlaying(false);
      setPlayingVideo(null);
    } else {
      // Start video
      setPlayingVideo(videoSrc);
      setVideoPlaying(true);
    }
  };

  // Navigation functions for convenience carousel
  const nextConvenienceCard = () => {
    // Close carousels if open when navigating
    if (isSeatingConfigCarouselOpen) {
      setIsSeatingConfigCarouselOpen(false);
    }
    if (isMoreFeaturesCarouselOpen) {
      setIsMoreFeaturesCarouselOpen(false);
    }
    setCurrentConvenienceCard((prev) =>
      Math.min(prev + 1, convenienceFeatures.length - 3)
    );
  };

  const prevConvenienceCard = () => {
    // Close carousels if open when navigating
    if (isSeatingConfigCarouselOpen) {
      setIsSeatingConfigCarouselOpen(false);
    }
    if (isMoreFeaturesCarouselOpen) {
      setIsMoreFeaturesCarouselOpen(false);
    }
    setCurrentConvenienceCard((prev) => Math.max(prev - 1, 0));
  };

  // Navigation functions for performance carousel
  const nextPerformanceCard = () => {
    setCurrentPerformanceCard((prev) =>
      Math.min(prev + 1, performanceFeatures.length - 3)
    );
  };

  const prevPerformanceCard = () => {
    setCurrentPerformanceCard((prev) => Math.max(prev - 1, 0));
  };

  // Swipe handlers for mobile
  const minSwipeDistance = 50;
  const [safetyTouchStart, setSafetyTouchStart] = useState<number | null>(null);
  const [safetyTouchEnd, setSafetyTouchEnd] = useState<number | null>(null);
  const [convenienceTouchStart, setConvenienceTouchStart] = useState<
    number | null
  >(null);
  const [convenienceTouchEnd, setConvenienceTouchEnd] = useState<number | null>(
    null
  );
  const [performanceTouchStart, setPerformanceTouchStart] = useState<
    number | null
  >(null);
  const [performanceTouchEnd, setPerformanceTouchEnd] = useState<number | null>(
    null
  );

  const onSafetyTouchStart = (e: React.TouchEvent) => {
    setSafetyTouchEnd(null);
    setSafetyTouchStart(e.targetTouches[0].clientX);
  };

  const onSafetyTouchMove = (e: React.TouchEvent) => {
    setSafetyTouchEnd(e.targetTouches[0].clientX);
  };

  const onSafetyTouchEnd = () => {
    if (!safetyTouchStart || !safetyTouchEnd) return;
    const distance = safetyTouchStart - safetyTouchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentSafetyCard < safetyFeatures.length - 1) {
      setCurrentSafetyCard((prev) => prev + 1);
    }
    if (isRightSwipe && currentSafetyCard > 0) {
      setCurrentSafetyCard((prev) => prev - 1);
    }
  };

  const onConvenienceTouchStart = (e: React.TouchEvent) => {
    setConvenienceTouchEnd(null);
    setConvenienceTouchStart(e.targetTouches[0].clientX);
  };

  const onConvenienceTouchMove = (e: React.TouchEvent) => {
    setConvenienceTouchEnd(e.targetTouches[0].clientX);
  };

  const onConvenienceTouchEnd = () => {
    if (!convenienceTouchStart || !convenienceTouchEnd) return;
    const distance = convenienceTouchStart - convenienceTouchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (
      isLeftSwipe &&
      currentConvenienceCard < convenienceFeatures.length - 1
    ) {
      setCurrentConvenienceCard((prev) => prev + 1);
    }
    if (isRightSwipe && currentConvenienceCard > 0) {
      setCurrentConvenienceCard((prev) => prev - 1);
    }
  };

  const onPerformanceTouchStart = (e: React.TouchEvent) => {
    setPerformanceTouchEnd(null);
    setPerformanceTouchStart(e.targetTouches[0].clientX);
  };

  const onPerformanceTouchMove = (e: React.TouchEvent) => {
    setPerformanceTouchEnd(e.targetTouches[0].clientX);
  };

  const onPerformanceTouchEnd = () => {
    if (!performanceTouchStart || !performanceTouchEnd) return;
    const distance = performanceTouchStart - performanceTouchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const maxPerformanceIndex = Math.max(
      0,
      performanceFeatures.length - 3
    );

    if (isLeftSwipe && currentPerformanceCard < maxPerformanceIndex) {
      setCurrentPerformanceCard((prev) => prev + 1);
    }
    if (isRightSwipe && currentPerformanceCard > 0) {
      setCurrentPerformanceCard((prev) => prev - 1);
    }
  };

  // Specification carousel navigation
  const nextSpecImage = () => {
    setCurrentSpecImage((prev) => (prev + 1) % specImages.length);
  };
  const prevSpecImage = () => {
    setCurrentSpecImage(
      (prev) => (prev - 1 + specImages.length) % specImages.length
    );
  };

  // Accordion toggle
  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? -1 : index);
  };

  // Specification accordion toggle
  const toggleSpecAccordion = (index: number) => {
    setActiveSpecAccordion(activeSpecAccordion === index ? -1 : index);
  };

  return (
    <div className="min-h-screen bg-black text-white w-full overflow-x-hidden">
      <Navbar />

      {/* Hero Section - 100% copy: section-hero active > hero-visual-wrap (video) + main-section > text-box (top=285px, 1440x200) */}
      <section className="section-hero active type-dark relative h-screen overflow-hidden w-full bg-black">
        <div className="hero-visual-wrap absolute inset-0 w-full h-full z-0">
          <div className="video-box absolute inset-0 w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              onLoadedData={() => setIsVideoLoaded(true)}
            >
              <source
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/20250912140313696_bZrvti_compressed.mp4"
                type="video/mp4"
              />
              <Image
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/20250123100604289_9mmu8c.png"
                alt="Torres Hybrid"
                fill
                className="object-cover"
              />
            </video>
            <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
          </div>
        </div>
        <div className="main-section absolute left-0 right-0 bottom-0 z-10 w-full max-w-[1440px] mx-auto flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-8 lg:pb-12">
          <div className="text-box w-full max-w-[1440px] flex flex-col font-sans bg-transparent rounded-lg p-6 lg:p-8" style={{ color: "#ffffff" }}>
            <div className="text-info">
              <h2><span>TORRES HYBRID</span></h2>
              <p><span>Explore More, Discover More</span></p>
            </div>
            <div className="text-box-bottom">
              <div className="btn-group">
                <a href="#catalog" className="btn">CATALOG</a>
                <a href="#accessory" className="btn">ACCESSORY</a>
              </div>
              <div className="selling-point">
                <div className="selling-point__box">
                  <div className="selling-point__img">
                    <img src="https://en.kg-mobility.com/attached/contents/display/image/2000003000100090002/20250903152504697_g6Mnsh.svg" alt="Freedom, Redefined" className="w-10 h-10 lg:w-12 lg:h-12" />
                  </div>
                  <div className="selling-point__text">
                    <p className="point-text">Dual Tech Hybrid</p>
                    <p className="point-title">Freedom, Redefined</p>
                  </div>
                </div>
                <div className="selling-point__box">
                  <div className="selling-point__img">
                    <img src="https://en.kg-mobility.com/attached/contents/display/image/2000003000100090002/20250903152630515_9PLwRO.svg" alt="Torres in Black" className="w-10 h-10 lg:w-12 lg:h-12" />
                  </div>
                  <div className="selling-point__text">
                    <p className="point-text">Black Edition</p>
                    <p className="point-title">Torres in Black</p>
                  </div>
                </div>
                <div className="selling-point__box">
                  <div className="selling-point__img">
                    <img src="https://en.kg-mobility.com/attached/contents/display/image/2000003000100090002/20250903152714317_ceMfan.svg" alt="Quieter Drive" className="w-10 h-10 lg:w-12 lg:h-12" />
                  </div>
                  <div className="selling-point__text">
                    <p className="point-text">Enhanced NVH</p>
                    <p className="point-title">Quieter Drive</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Second Section - Scroll-based Video and Text Animation */}
      <section ref={section2Ref} className="relative  bg-black overflow-hidden">
        {/* Video Container - Centered and responsive to scroll */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          <motion.div className="relative h-full" style={{ width: videoWidth }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full  object-cover"
            >
              <source
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/section2/20250124144836835_QSX4Io.mp4"
                type="video/mp4"
              />
            </video>

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/70"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Second Section - Video with Scroll Animation */}
      <section
        ref={section2Ref}
        className="relative h-screen bg-black overflow-hidden z-20"
      >
        {/* Solid black background to ensure no overlap */}
        <div className="absolute inset-0 bg-black z-0"></div>

        {/* Video Container */}
        <div className="relative w-full h-full flex items-center justify-center z-10">
          <motion.video
            autoPlay
            muted
            loop
            playsInline
            className="object-cover"
            style={{
              width: videoWidth,
              height: videoHeight,
            }}
          >
            <source
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/20250904145407203_bXYwew.mp4"
              type="video/mp4"
            />
          </motion.video>
        </div>

        {/* Text Overlay - Changes size based on scroll */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{
            opacity: textOpacity,
          }}
        >
          <motion.h2
            className="text-white font-bold uppercase text-center px-8"
            style={{
              fontSize: textSize,
              lineHeight: textLineHeight,
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            {language === "fr"
              ? "L'hybride que vous attendiez"
              : "The Hybrid You've Been Waiting For"}
          </motion.h2>
        </motion.div>
      </section>

      {/* Exterior Section */}
      <section className="relative min-h-[41vh] lg:min-h-[800px] bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden py-8 lg:py-16">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-100 to-black"></div>

        {/* Day & Night Section */}
        <div className="relative z-10 w-[80%] max-w-6xl mx-auto py-12 lg:py-16 min-h-[600px] lg:min-h-[720px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h3 className="text-white text-2xl lg:text-3xl font-bold uppercase tracking-wide">
              {language === "fr" ? "Jour & Nuit" : "Day & Night"}
            </h3>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="flex bg-white/10 backdrop-blur-sm rounded-full p-1">
              <label className="flex cursor-pointer">
                <input
                  type="radio"
                  name="day-night-view"
                  value="front"
                  checked={dayNightView === "front"}
                  onChange={() => {
                    setDayNightView("front");
                    setDayNightSplit(50);
                  }}
                  className="sr-only"
                />
                <span
                  className={`block px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    dayNightView === "front"
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  {language === "fr" ? "Avant" : "Front"}
                </span>
              </label>
              <label className="flex cursor-pointer">
                <input
                  type="radio"
                  name="day-night-view"
                  value="rear"
                  checked={dayNightView === "rear"}
                  onChange={() => {
                    setDayNightView("rear");
                    setDayNightSplit(50);
                  }}
                  className="sr-only"
                />
                <span
                  className={`block px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                    dayNightView === "rear"
                      ? "bg-white text-black"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  {language === "fr" ? "Arrière" : "Rear"}
                </span>
              </label>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-xl overflow-hidden shadow-2xl"
          >
            <div
              ref={dayNightSliderRef}
              className="relative w-full h-[360px] lg:h-[520px] min-h-[360px] lg:min-h-[520px] select-none cursor-col-resize"
              onMouseDown={(e) => {
                setIsDayNightDragging(true);
                updateDayNightSplit(e.clientX);
              }}
            >
              {/* Night image (full, base layer) - same size/position for both */}
              <div className="absolute inset-0 flex items-center justify-center rounded-xl overflow-hidden">
                {dayNightView === "front" ? (
                  <Image
                    src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/nightday/20250904155526167_464Mcv.jpg"
                    alt={language === "fr" ? "Nuit (Avant)" : "Night (Front)"}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Image
                    src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/nightday/20250904155655365_vysRfF.jpg"
                    alt={language === "fr" ? "Nuit (Arrière)" : "Night (Rear)"}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
              </div>
              {/* Day image (clipped to left of split) - same size/position */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none rounded-xl overflow-hidden"
                style={{
                  clipPath: `inset(0 ${100 - dayNightSplit}% 0 0)`,
                }}
              >
                {dayNightView === "front" ? (
                  <Image
                    src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/nightday/20250904155504017_y39ZDU.jpg"
                    alt={language === "fr" ? "Jour (Avant)" : "Day (Front)"}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Image
                    src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/nightday/20250904155635842_k7jzH0.jpg"
                    alt={language === "fr" ? "Jour (Arrière)" : "Day (Rear)"}
                    width={800}
                    height={600}
                    className="w-full h-full object-cover rounded-xl"
                  />
                )}
              </div>
              {/* Day / Night labels - inside the image area */}
              <div className="absolute bottom-6 left-1/4 -translate-x-1/2 z-10 pointer-events-none">
                <span className="text-black font-semibold text-sm lg:text-base uppercase tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]">
                  {language === "fr" ? "Jour" : "Day"}
                </span>
              </div>
              <div className="absolute bottom-6 left-3/4 -translate-x-1/2 z-10 pointer-events-none">
                <span className="text-white font-semibold text-sm lg:text-base uppercase tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {language === "fr" ? "Nuit" : "Night"}
                </span>
              </div>
              {/* Draggable divider line */}
              <div
                className="absolute top-1/2 w-0.5 h-[50px] -translate-y-1/2 bg-white/90 shadow-lg z-20"
                style={{ left: `${dayNightSplit}%`, transform: "translate(-50%, -50%)" }}
              >
                <button
                  type="button"
                  className="btn-day-night absolute left-1/2 top-1/2 w-14 h-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-800/95 text-white border-2 border-white/80 shadow-xl flex items-center justify-center gap-0.5 hover:bg-gray-700/95 transition-colors cursor-grab active:cursor-grabbing"
                  aria-label={language === "fr" ? "Déplacer pour comparer jour et nuit" : "Drag to compare day and night"}
                >
                  <span className="text-white font-bold text-lg" aria-hidden="true">&lsaquo;</span>
                  <span className="w-px h-5 bg-white/80" aria-hidden="true" />
                  <span className="text-white font-bold text-lg" aria-hidden="true">&rsaquo;</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Header */}
        <div className="relative z-10 pt-8 lg:pt-16 text-center">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-white text-lg uppercase tracking-wide mb-4"
          >
            {language === "fr" ? "EXTÉRIEUR" : "EXTERIOR"}
          </motion.h3>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-kgm-amber text-3xl lg:text-4xl font-bold uppercase tracking-wide mb-8 lg:mb-0"
          >
            {language === "fr"
              ? "ESPRIT ET HÉRITAGE DE KGM"
              : "SPIRIT & HERITAGE OF KGM"}
          </motion.h2>
        </div>

        {/* View Selector - Front / Rear (same as Tivoli) */}
        <div className="relative z-10 flex justify-center mt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex bg-white/10 backdrop-blur-sm rounded-full p-1"
          >
            <button
              onClick={() => {
                setExteriorCarView("front");
                setSelectedHotspot(null);
                setIsSideMenuOpen(false);
              }}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                exteriorCarView === "front"
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              {language === "fr" ? "Avant" : "Front"}
            </button>
            <button
              onClick={() => {
                setExteriorCarView("rear");
                setSelectedHotspot(null);
                setIsSideMenuOpen(false);
              }}
              className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                exteriorCarView === "rear"
                  ? "bg-white text-black"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              {language === "fr" ? "Arrière" : "Rear"}
            </button>
          </motion.div>
        </div>

        {/* Car Display */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-8">
          <motion.div
            key={exteriorCarView}
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0 }}
            className="relative w-full max-w-[80%] lg:max-w-none h-[17.5vh] lg:h-[700px] flex items-center justify-center mb-20 lg:mb-40"
          >
            {exteriorCarView === "front" ? (
              <>
                {/* Wrapper sized to image aspect ratio so hotspots are relative to image */}
                <div
                  className="relative h-full w-auto flex-none"
                  style={{
                    aspectRatio: exteriorImageAspect ?? 4 / 5,
                  }}
                >
                  <Image
                    src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/exterior/front.png"
                    alt="TORRES front view"
                    fill
                    className="object-contain"
                    style={{
                      backgroundColor: "transparent",
                      mixBlendMode: "normal",
                    }}
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (img?.naturalWidth && img?.naturalHeight) {
                        setExteriorImageAspect(
                          img.naturalWidth / img.naturalHeight
                        );
                      }
                    }}
                  />
                  {/* Interactive Hotspots - front view only */}
                  {carHotspots.map((hotspot) => (
                    <motion.button
                      key={hotspot.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute w-4 h-4 lg:w-8 lg:h-8 bg-kgm-amber rounded-full flex items-center justify-center text-black font-bold text-xs lg:text-lg shadow-lg hover:bg-kgm-amber/80 transition-all duration-300"
                      style={{
                        left: hotspot.position.x,
                        top: hotspot.position.y,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => handleHotspotClick(hotspot.id)}
                    >
                      +
                    </motion.button>
                  ))}
                  {/* Hotspot Info Panel */}
                  {activeHotspot && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 max-w-xs"
                    >
                      <h4 className="text-kgm-amber font-bold text-lg mb-2">
                        {carHotspots.find((h) => h.id === activeHotspot)?.title}
                      </h4>
                      <p className="text-white text-sm">
                        {carHotspots.find((h) => h.id === activeHotspot)?.description}
                      </p>
                      <button
                        onClick={() => setActiveHotspot(null)}
                        className="absolute top-2 right-2 text-white/60 hover:text-white"
                      >
                        ×
                      </button>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Wrapper sized to rear image aspect ratio so hotspot positions stay relative to image */}
                <div
                  className="relative h-full w-auto flex-none"
                  style={{
                    aspectRatio: exteriorRearImageAspect ?? 4 / 5,
                  }}
                >
                  <Image
                    src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/exterior/back.png"
                    alt="TORRES rear view"
                    fill
                    className="object-contain"
                    style={{
                      backgroundColor: "transparent",
                      mixBlendMode: "normal",
                    }}
                    onLoad={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (img?.naturalWidth && img?.naturalHeight) {
                        setExteriorRearImageAspect(
                          img.naturalWidth / img.naturalHeight
                        );
                      }
                    }}
                  />
                  {/* Rear view hotspots - positions in % relative to image */}
                  {rearHotspots.map((hotspot) => (
                    <motion.button
                      key={hotspot.id}
                      type="button"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute w-4 h-4 lg:w-8 lg:h-8 bg-kgm-amber rounded-full flex items-center justify-center text-black font-bold text-xs lg:text-lg shadow-lg hover:bg-kgm-amber/80 transition-all duration-300"
                      style={{
                        left: hotspot.position.x,
                        top: hotspot.position.y,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => handleHotspotClick(hotspot.id)}
                      aria-label={language === "fr" ? "Voir cette partie en détail" : "View this part in detail"}
                    >
                      +
                    </motion.button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Car Feature Sidebar Component */}
        <CarFeatureSidebar
          isOpen={
            isSideMenuOpen &&
            (selectedHotspot === "headlight" ||
              selectedHotspot === "grille" ||
              selectedHotspot === "foglight" ||
              selectedHotspot === "wheel" ||
              selectedHotspot === "roof" ||
              selectedHotspot === "rear_1" ||
              selectedHotspot === "rear_2" ||
              selectedHotspot === "rear_3" ||
              selectedHotspot === "rear_4" ||
              selectedHotspot === "rear_5")
          }
          onClose={() => setIsSideMenuOpen(false)}
          selectedHotspot={selectedHotspot}
          getHotspotContent={getHotspotContent}
          currentHotspotImage={currentHotspotImage}
          setCurrentHotspotImage={setCurrentHotspotImage}
        />
      </section>

      {/* Color Configurator Section */}
      <section className="relative bg-black overflow-hidden">
        {/* Car Display Area */}
        <div className="relative z-10 flex-1 flex items-center justify-center mt-8">
          {(viewMode as "color" | "vr") === "color" ? (
            <motion.div
              key={`${selectedColor}-${toneMode}`}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0 }}
              className="relative w-full h-[500px] flex items-center justify-center bg-black"
            >
              <Image
                key={`${selectedColor}-${toneMode}`}
                src={
                  toneMode === "1 TONE"
                    ? carColors[selectedColor].oneTone
                    : carColors[selectedColor].twoTone
                }
                alt={`TORRES in ${carColors[selectedColor].name} - ${toneMode}`}
                fill
                className="object-cover w-full h-full"
                priority
                style={{
                  backgroundColor: "black",
                  mixBlendMode: "normal",
                }}
              />

              {/* Top Navigation Buttons */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0 }}
                  className="flex bg-white/20 backdrop-blur-sm rounded-full p-1"
                >
                  <button
                    onClick={() => setViewMode("color")}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      (viewMode as "color" | "vr") === "color"
                        ? "bg-blue-600 text-white"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    {language === "fr" ? "Palette de Couleurs" : "Color Board"}
                  </button>
                  <button
                    onClick={() => setViewMode("vr")}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      (viewMode as "color" | "vr") === "vr"
                        ? "bg-blue-600 text-white"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    {language === "fr" ? "360° VR" : "360° VR"}
                  </button>
                </motion.div>
              </div>

              {/* Color Selection Panel - Inside Image */}
              <div className="absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg lg:rounded-2xl p-2 lg:p-4 max-w-[98%] lg:max-w-2xl mx-auto shadow-2xl"
                >
                  {/* Current Color Name */}
                  <div className="text-center mb-1.5 lg:mb-4">
                    <h3 className="text-xs lg:text-lg font-bold text-white">
                      {carColors[selectedColor].name}
                    </h3>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex justify-center gap-1 lg:gap-3 mb-1.5 lg:mb-4">
                    {carColors.map((color) => (
                      <motion.button
                        key={color.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleColorSelection(color.id)}
                        className={`rounded-full border-2 transition-all duration-300 ${
                          selectedColor === color.id
                            ? "border-white scale-110"
                            : "border-white/50 hover:border-white"
                        }`}
                        style={{
                          backgroundColor: color.colorSwatch,
                          width: "18px",
                          height: "18px",
                        }}
                      >
                        {selectedColor === color.id && (
                          <div className="w-full h-full rounded-full flex items-center justify-center">
                            <svg
                              className="text-white w-2 h-2 lg:w-3 lg:h-3"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Tone Options - Only show if color has two tones */}
                  {carColors[selectedColor].hasTwoTones && (
                    <div className="flex justify-center gap-3 lg:gap-8">
                      <label className="flex items-center gap-1 lg:gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tone"
                          value="1 TONE"
                          checked={toneMode === "1 TONE"}
                          onChange={(e) =>
                            setToneMode(e.target.value as "1 TONE" | "2 TONE")
                          }
                          className="w-2.5 h-2.5 lg:w-4 lg:h-4 text-blue-600"
                        />
                        <span className="text-white font-semibold text-[9px] lg:text-sm">
                          {language === "fr" ? "1 TON" : "1 TONE"}
                        </span>
                      </label>
                      <label className="flex items-center gap-1 lg:gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tone"
                          value="2 TONE"
                          checked={toneMode === "2 TONE"}
                          onChange={(e) =>
                            setToneMode(e.target.value as "1 TONE" | "2 TONE")
                          }
                          className="w-2.5 h-2.5 lg:w-4 lg:h-4 text-blue-600"
                        />
                        <span className="text-white font-semibold text-[9px] lg:text-sm">
                          {language === "fr" ? "2 TONS" : "2 TONE"}
                        </span>
                      </label>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Disclaimer Text */}
              <div className="hidden md:block absolute bottom-4 left-4 lg:bottom-8 lg:left-8 text-left max-w-md pl-4 lg:pl-8 z-30">
                <p
                  className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed font-medium"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                  }}
                >
                  {language === "fr"
                    ? "* Les images de ce véhicule sont fournies à titre indicatif uniquement et peuvent différer du produit réel."
                    : "* Images of this vehicle are for reference only and may differ from the actual product."}
                </p>
                <p
                  className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed mt-0.5 lg:mt-1 font-medium"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                  }}
                >
                  {language === "fr"
                    ? "* Chaque couleur est arrangée de gauche à droite selon la préférence des clients."
                    : "* Each color is arranged from left to right in order of customer preference."}
                </p>
              </div>
            </motion.div>
          ) : (
            /* 360° VR View */
            <motion.div
              key="vr-view"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0 }}
              className="relative w-full h-[500px] flex items-center justify-center bg-black"
            >
              {/* 360° VR Background */}
              <Image
                src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/Tivoli/section3/bg%20360vr/rotate-bg.png"
                alt="360° VR Background"
                fill
                className="object-cover w-full h-full"
                priority
                style={{
                  backgroundColor: "black",
                  mixBlendMode: "normal",
                }}
              />

              {/* 360° VR Viewer */}
              {getCurrentVrImages().length > 0 ? (
                <div
                  className="absolute inset-0 z-10 select-none cursor-pointer"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    touchAction: "none",
                    WebkitTouchCallout: "none",
                    WebkitUserSelect: "none",
                    userSelect: "none",
                  }}
                >
                  {/* Crossfade between two frames for smooth transitions */}
                  {(() => {
                    const vrImages = getCurrentVrImages();
                    if (!vrImages || vrImages.length === 0) return null;

                    const safeCurrentFrame =
                      isNaN(currentFrame) || currentFrame < 0
                        ? 0
                        : currentFrame;
                    const currentFrameIndex =
                      Math.floor(safeCurrentFrame) % FRAME_COUNT;
                    const nextFrameIndex =
                      (currentFrameIndex + 1) % FRAME_COUNT;
                    const fractional =
                      safeCurrentFrame - Math.floor(safeCurrentFrame);
                    const currentOpacity = Math.max(
                      0,
                      Math.min(1, 1 - fractional)
                    );
                    const nextOpacity = Math.max(0, Math.min(1, fractional));

                    if (
                      !vrImages[currentFrameIndex] ||
                      !vrImages[nextFrameIndex]
                    )
                      return null;

                    return (
                      <>
                        {/* Current frame */}
                        <Image
                          key={`${toneMode}-${currentFrameIndex}-current`}
                          src={vrImages[currentFrameIndex]}
                          alt={`360° View - Frame ${
                            currentFrameIndex + 1
                          }/${FRAME_COUNT}`}
                          width={800}
                          height={600}
                          unoptimized
                          priority
                          className="object-contain"
                          style={{
                            position: "absolute",
                            backgroundColor: "transparent",
                            mixBlendMode: "normal",
                            opacity: currentOpacity,
                            transition: "opacity 0.15s ease-out",
                            willChange: "opacity",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 1,
                            maxWidth: "100vw",
                            maxHeight: "100%",
                            width: "auto",
                            height: "auto",
                            minWidth: "200px",
                          }}
                        />
                        {/* Next frame (for crossfade) */}
                        <Image
                          key={`${toneMode}-${nextFrameIndex}-next`}
                          src={vrImages[nextFrameIndex]}
                          alt={`360° View - Frame ${
                            nextFrameIndex + 1
                          }/${FRAME_COUNT}`}
                          width={800}
                          height={600}
                          unoptimized
                          priority
                          className="object-contain"
                          style={{
                            position: "absolute",
                            backgroundColor: "transparent",
                            mixBlendMode: "normal",
                            opacity: nextOpacity,
                            transition: "opacity 0.15s ease-out",
                            willChange: "opacity",
                            left: "50%",
                            top: "50%",
                            transform: "translate(-50%, -50%)",
                            zIndex: 2,
                            maxWidth: "100vw",
                            maxHeight: "100%",
                            width: "auto",
                            height: "auto",
                            minWidth: "200px",
                          }}
                        />
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-4">360° VR View</h3>
                    <p className="text-lg opacity-80">
                      VR images not available for this color/tone combination
                    </p>
                  </div>
                </div>
              )}

              {/* Top Navigation Buttons */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0 }}
                  className="flex bg-white/20 backdrop-blur-sm rounded-full p-1"
                >
                  <button
                    onClick={() => setViewMode("color")}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      (viewMode as "color" | "vr") === "color"
                        ? "bg-blue-600 text-white"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                    Color Board
                  </button>
                  <button
                    onClick={() => setViewMode("vr")}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
                      (viewMode as "color" | "vr") === "vr"
                        ? "bg-blue-600 text-white"
                        : "text-white hover:bg-white/20"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    360° VR
                  </button>
                </motion.div>
              </div>

              {/* Color Selection Panel - Inside VR View */}
              <div className="absolute bottom-4 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0 }}
                  className="bg-white/20 backdrop-blur-sm rounded-lg lg:rounded-2xl p-2 lg:p-4 max-w-[98%] lg:max-w-2xl mx-auto shadow-2xl"
                >
                  {/* Current Color Name */}
                  <div className="text-center mb-1.5 lg:mb-4">
                    <h3 className="text-xs lg:text-lg font-bold text-white">
                      {carColors[selectedColor].name}
                    </h3>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex justify-center gap-1 lg:gap-3 mb-1.5 lg:mb-4">
                    {carColors.map((color) => (
                      <motion.button
                        key={color.id}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleColorSelection(color.id)}
                        className={`rounded-full border-2 transition-all duration-300 ${
                          selectedColor === color.id
                            ? "border-white scale-110"
                            : "border-white/50 hover:border-white"
                        }`}
                        style={{
                          backgroundColor: color.colorSwatch,
                          width: "18px",
                          height: "18px",
                        }}
                      >
                        {selectedColor === color.id && (
                          <div className="w-full h-full rounded-full flex items-center justify-center">
                            <svg
                              className="text-white w-2 h-2 lg:w-3 lg:h-3"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Tone Options - Only show if color has two tones */}
                  {carColors[selectedColor].hasTwoTones && (
                    <div className="flex justify-center gap-3 lg:gap-8">
                      <label className="flex items-center gap-1 lg:gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tone"
                          value="1 TONE"
                          checked={toneMode === "1 TONE"}
                          onChange={(e) =>
                            setToneMode(e.target.value as "1 TONE" | "2 TONE")
                          }
                          className="w-2.5 h-2.5 lg:w-4 lg:h-4 text-blue-600"
                        />
                        <span className="text-white font-semibold text-[9px] lg:text-sm">
                          1 TONE
                        </span>
                      </label>
                      <label className="flex items-center gap-1 lg:gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="tone"
                          value="2 TONE"
                          checked={toneMode === "2 TONE"}
                          onChange={(e) =>
                            setToneMode(e.target.value as "1 TONE" | "2 TONE")
                          }
                          className="w-2.5 h-2.5 lg:w-4 lg:h-4 text-blue-600"
                        />
                        <span className="text-white font-semibold text-[9px] lg:text-sm">
                          2 TONE
                        </span>
                      </label>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Disclaimer Text */}
              <div className="hidden md:block absolute bottom-4 left-4 lg:bottom-8 lg:left-8 text-left max-w-md pl-4 lg:pl-8 z-30">
                <p
                  className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed font-medium"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                  }}
                >
                  {language === "fr"
                    ? "* Les images de ce véhicule sont fournies à titre indicatif uniquement et peuvent différer du produit réel."
                    : "* Images of this vehicle are for reference only and may differ from the actual product."}
                </p>
                <p
                  className="text-white text-[8px] lg:text-xs leading-tight lg:leading-relaxed mt-0.5 lg:mt-1 font-medium"
                  style={{
                    textShadow:
                      "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                  }}
                >
                  {language === "fr"
                    ? "* Chaque couleur est arrangée de gauche à droite selon la préférence des clients."
                    : "* Each color is arranged from left to right in order of customer preference."}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Section 4: Modern & Sleek Display */}
        <section
          ref={section4Ref}
          className="relative h-screen bg-black overflow-hidden"
        >
          <motion.div
            className="sticky top-0 w-full h-screen flex items-center justify-center"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            {/* Background Video */}
            <motion.div
              className="relative h-full flex items-center justify-center"
              style={{
                width: section4VideoWidth,
                height: "100%",
              }}
            >
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                playsInline
              >
                <source
                  src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/section4/20250220173530895_DesXdL.mp4"
                  type="video/mp4"
                />
              </video>

              {/* Text Overlay */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                style={{
                  scale: section4TextScale,
                  opacity: 1,
                }}
              >
                <h2
                  className="text-white font-bold text-center leading-tight"
                  style={{
                    fontSize: "70px",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                  }}
                  dangerouslySetInnerHTML={{
                    __html:
                      language === "fr"
                        ? "Un cockpit pensé pour le conducteur"
                        : "DRIVER-CENTRIC COCKPIT",
                  }}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        {/* Section 5: Interior Features & Colors */}
        <section className="relative bg-black overflow-hidden">
          {/* Header */}
          <div
            className="absolute top-0 left-0 right-0 md:top-8 md:left-1/2 md:transform md:-translate-x-1/2 z-20 text-center px-0 md:px-4"
            style={{ bottom: isMobile ? "calc(21vh + 5px)" : undefined }}
          >
            <h2 className="text-kgm-amber text-sm font-light mb-2">
              {language === "fr" ? (
                <>
                  <span
                    className="font-bold text-white"
                    style={{
                      textShadow:
                        "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                    }}
                  >
                    INTÉRIEUR
                  </span>
                </>
              ) : (
                <>
                  <span
                    className="font-bold text-white"
                    style={{
                      textShadow:
                        "2px 2px 4px rgba(0, 0, 0, 1), -1px -1px 2px rgba(0, 0, 0, 1), 1px -1px 2px rgba(0, 0, 0, 1), -1px 1px 2px rgba(0, 0, 0, 1)",
                    }}
                  >
                    INTERIOR
                  </span>
                </>
              )}
            </h2>
          </div>

          {/* Second Interior Image - Charcoal Black */}
          <div className="relative w-full h-screen flex items-center justify-center">
            <Image
              src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Modelspage/TORRES/section5/20250124153817822_MTKopA_1.jpg"
              alt="Charcoal Black interior color scheme"
              fill
              className="object-cover"
              quality={90}
            />

            {/* Color Scheme Text Overlay */}
            <div className="absolute bottom-8 left-8 z-30">
              <h3 className="text-white text-4xl md:text-5xl font-bold mb-2">
                CHARCOAL BLACK
              </h3>
              <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white text-sm">
                  *{" "}
                  {language === "fr"
                    ? "Les photos et descriptions sont fournies à titre indicatif et peuvent différer du produit réel."
                    : "The photos and descriptions are provided for reference only and may differ from the actual product."}
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* Section 6: Safety - Safe and Sound on Every Road (id="SAFETY") */}
        <section className="relative py-20 bg-black overflow-hidden w-full">
          <div id="SAFETY" className="SAFETY safety-etc-section">
            <div className="contents-wrap motion-target">
              <div className="section-scp__text default-section text-center mb-16">
                <strong className="motion-box text-white text-sm font-light block mb-2">
                  {language === "fr" ? "SÉCURITÉ" : "SAFETY"}
                </strong>
                <span className="sub-title motion-box text-white/90 text-lg md:text-xl block">
                  {language === "fr"
                    ? "SÉCURISÉ ET SÛR SUR TOUTES LES ROUTES"
                    : "SAFE AND SOUND ON EVERY ROAD"}
                </span>
              </div>
            </div>
            <div className="safety-performance-wrap relative max-w-7xl mx-auto px-0 md:px-4 w-full overflow-hidden">
              {/* Cards Container */}
              <div className="relative overflow-hidden w-full">
                <div
                  className="flex transition-transform duration-700 ease-out safety-slider w-full"
                  style={{
                    transform: isMobile
                      ? currentSafetyCard === 0
                        ? "translateX(0%)"
                        : `translateX(calc(-${8 + currentSafetyCard * 69}%))`
                      : `translateX(-${currentSafetyCard * (100 / 3)}%)`,
                  }}
                  onTouchStart={onSafetyTouchStart}
                  onTouchMove={onSafetyTouchMove}
                  onTouchEnd={onSafetyTouchEnd}
                >
                  {safetyFeatures.map((feature, index) => (
                    <React.Fragment key={feature.id}>
                      <div
                        className="safety-card flex-shrink-0 w-[65%] md:w-[33.333%] mr-[4%] md:mr-0 md:px-4"
                        style={{
                          marginLeft: index === 0 && isMobile ? "8%" : "0",
                        }}
                      >
                        <div className="slide-item-wrap">
                          <div
                            className="gallery-wrap rounded-lg overflow-hidden relative"
                            style={{ height: isMobile ? "450px" : "514px" }}
                          >
                            {playingVideo === feature.video && videoPlaying ? (
                              <video
                                src={feature.video}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            ) : (
                              <Image
                                src={feature.image}
                                alt={feature.subtitle}
                                fill
                                className="object-cover"
                                quality={90}
                              />
                            )}
                            <div
                              className="absolute inset-0 z-[5] pointer-events-none"
                              style={{
                                background:
                                  "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)",
                              }}
                            />
                            {!(
                              playingVideo === feature.video && videoPlaying
                            ) && (
                              <div className="text-box absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                                <div className="flex flex-col backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                  <h3
                                    className={`${feature.textColor} text-sm font-light mb-2 drop-shadow-lg`}
                                  >
                                    {feature.title}
                                  </h3>
                                  <h2
                                    className={`${feature.subtitleColor} text-xl md:text-2xl font-bold mb-3 md:mb-4 drop-shadow-lg`}
                                  >
                                    {feature.subtitle}
                                  </h2>
                                  {feature.hasOpenButton && (
                                    <ToggleButton
                                      isOpen={
                                        (feature.id === 1 &&
                                          isADASCarouselOpen) ||
                                        (feature.id === 5 &&
                                          isESCCarouselOpen) ||
                                        (feature.id === 7 &&
                                          isAdditionalSafetyCarouselOpen)
                                      }
                                      onClick={() => {
                                        if (feature.id === 1) {
                                          setIsADASCarouselOpen(
                                            (prev) => !prev
                                          );
                                        } else if (feature.id === 5) {
                                          setIsESCCarouselOpen(
                                            (prev) => !prev
                                          );
                                        } else if (feature.id === 7) {
                                          setIsAdditionalSafetyCarouselOpen(
                                            (prev) => !prev
                                          );
                                        }
                                      }}
                                    />
                                  )}
                                </div>
                                <div className="flex flex-col items-start backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                  <p
                                    className={`${
                                      feature.description.includes(
                                        "Featuring an 8-way powered seat"
                                      ) ||
                                      feature.description.includes(
                                        "Toggle-switch type with auto hold"
                                      ) ||
                                      feature.description.includes(
                                        "By applying the HPF"
                                      ) ||
                                      feature.description.includes(
                                        "There are 8 airbags"
                                      )
                                        ? "text-white"
                                        : feature.textColor
                                    } text-sm leading-relaxed mb-4 drop-shadow-lg text-left`}
                                    dangerouslySetInnerHTML={{
                                      __html: feature.description,
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            {feature.video &&
                              !(
                                playingVideo === feature.video &&
                                videoPlaying
                              ) && (
                                <div className="absolute bottom-6 right-6 z-20">
                                  <button
                                    type="button"
                                    aria-label="Play video"
                                    title="Play video"
                                    onClick={() =>
                                      toggleVideo(feature.video!)
                                    }
                                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer"
                                  >
                                    <svg
                                      className="w-8 h-8 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            {feature.video &&
                              playingVideo === feature.video &&
                              videoPlaying && (
                                <div className="absolute bottom-6 right-6 z-20">
                                  <button
                                    type="button"
                                    aria-label="Pause video"
                                    title="Pause video"
                                    onClick={() =>
                                      toggleVideo(feature.video!)
                                    }
                                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer"
                                  >
                                    <svg
                                      className="w-8 h-8 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                      {feature.id === 1 && (
                        <SousSlider
                          items={adasCarouselData}
                          isOpen={isADASCarouselOpen}
                          onClose={() => setIsADASCarouselOpen(false)}
                          cardWidth="320px"
                          language={language}
                          itemsPerView={3}
                        />
                      )}
                      {feature.id === 5 && (
                        <SousSlider
                          items={escCarouselData}
                          isOpen={isESCCarouselOpen}
                          onClose={() => setIsESCCarouselOpen(false)}
                          cardWidth="320px"
                          language={language}
                          itemsPerView={3}
                        />
                      )}
                      {feature.id === 7 && (
                        <SousSlider
                          items={additionalSafetyCarouselData}
                          isOpen={isAdditionalSafetyCarouselOpen}
                          onClose={() =>
                            setIsAdditionalSafetyCarouselOpen(false)
                          }
                          cardWidth="320px"
                          language={language}
                          itemsPerView={3}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-6 md:mt-8">
                <div className="flex md:hidden items-center justify-center gap-2">
                  {safetyFeatures.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSafetyCard(index)}
                      className={`transition-all duration-300 rounded-full ${
                        currentSafetyCard === index
                          ? "w-2.5 h-2.5 bg-white"
                          : "w-2 h-2 bg-white/40"
                      }`}
                      aria-label={`Go to card ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="hidden md:block">
                  <CarouselNavigation
                    currentIndex={currentSafetyCard}
                    totalItems={safetyFeatures.length}
                    itemsPerView={3}
                    showPerCard={true}
                    onSlideChange={(index) => {
                      if (isADASCarouselOpen) {
                        setIsADASCarouselOpen(false);
                      }
                      if (isESCCarouselOpen) {
                        setIsESCCarouselOpen(false);
                      }
                      if (isAdditionalSafetyCarouselOpen) {
                        setIsAdditionalSafetyCarouselOpen(false);
                      }
                      setCurrentSafetyCard(index);
                    }}
                    onPrevious={prevSafetyCard}
                    onNext={nextSafetyCard}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7: Convenience - Same structure as Safety (id="CONVENIENCE") */}
        <section className="relative py-20 bg-black overflow-hidden w-full">
          <div id="CONVENIENCE" className="CONVENIENCE safety-etc-section">
            <div className="contents-wrap motion-target">
              <div className="section-scp__text default-section text-center mb-16">
                <strong className="motion-box text-white text-sm font-light block mb-2">
                  {language === "fr" ? "CONFORT" : "CONVENIENCE"}
                </strong>
                <span className="sub-title motion-box text-white/90 text-lg md:text-xl block">
                  {language === "fr"
                    ? "UN ESPACE PRATIQUE LORS DE L'EXPLORATION DE LA NATURE"
                    : "A CONVENIENT SPACE WHEN EXPLORING THE WILD"}
                </span>
              </div>
            </div>
            <div className="safety-performance-wrap relative max-w-7xl mx-auto px-0 md:px-4 w-full overflow-hidden">
              <div className="relative overflow-hidden w-full">
                <div
                  className="flex transition-transform duration-700 ease-out convenience-slider w-full"
                  style={{
                    transform: isMobile
                      ? currentConvenienceCard === 0
                        ? "translateX(0%)"
                        : `translateX(calc(-${8 + currentConvenienceCard * 69}%))`
                      : `translateX(-${currentConvenienceCard * (100 / 3)}%)`,
                  }}
                  onTouchStart={onConvenienceTouchStart}
                  onTouchMove={onConvenienceTouchMove}
                  onTouchEnd={onConvenienceTouchEnd}
                >
                  {convenienceFeatures.map((feature, index) => (
                    <React.Fragment key={feature.id}>
                      <div
                        className="safety-card flex-shrink-0 w-[65%] md:w-[33.333%] mr-[4%] md:mr-0 md:px-4"
                        style={{
                          marginLeft:
                            index === 0 && isMobile ? "8%" : "0",
                        }}
                      >
                        <div className="slide-item-wrap">
                          <div
                            className="gallery-wrap rounded-lg overflow-hidden relative"
                            style={{
                              height: isMobile ? "450px" : "514px",
                            }}
                          >
                            {feature.video &&
                            playingVideo === feature.video &&
                            videoPlaying ? (
                              <video
                                src={feature.video}
                                className="w-full h-full object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                              />
                            ) : (
                              <Image
                                src={feature.image}
                                alt={feature.subtitle}
                                fill
                                className="object-cover"
                                quality={90}
                              />
                            )}
                            <div
                              className="absolute inset-0 z-[5] pointer-events-none"
                              style={{
                                background:
                                  "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)",
                              }}
                            />
                            {!(
                              feature.video &&
                              playingVideo === feature.video &&
                              videoPlaying
                            ) && (
                              <div className="text-box absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                                <div className="flex flex-col backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                  <h3
                                    className={`${feature.textColor} text-sm font-light mb-2 drop-shadow-lg`}
                                  >
                                    {feature.title}
                                  </h3>
                                  <h2
                                    className={`${feature.subtitleColor} text-xl md:text-2xl font-bold mb-3 md:mb-4 drop-shadow-lg`}
                                  >
                                    {feature.subtitle}
                                  </h2>
                                  {feature.hasOpenButton && (
                                    <ToggleButton
                                      isOpen={isMoreFeaturesCarouselOpen}
                                      onClick={() =>
                                        setIsMoreFeaturesCarouselOpen(
                                          (prev) => !prev
                                        )
                                      }
                                    />
                                  )}
                                </div>
                                <div className="flex flex-col items-start backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                                  <p
                                    className={`${feature.textColor} text-sm leading-relaxed mb-4 drop-shadow-lg text-left`}
                                    dangerouslySetInnerHTML={{
                                      __html: feature.description,
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            {feature.video &&
                              !(
                                playingVideo === feature.video &&
                                videoPlaying
                              ) && (
                                <div className="absolute bottom-6 right-6 z-20">
                                  <button
                                    type="button"
                                    aria-label="Play video"
                                    title="Play video"
                                    onClick={() =>
                                      toggleVideo(feature.video!)
                                    }
                                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer"
                                  >
                                    <svg
                                      className="w-8 h-8 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M8 5v14l11-7z" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            {feature.video &&
                              playingVideo === feature.video &&
                              videoPlaying && (
                                <div className="absolute bottom-6 right-6 z-20">
                                  <button
                                    type="button"
                                    aria-label="Pause video"
                                    title="Pause video"
                                    onClick={() =>
                                      toggleVideo(feature.video!)
                                    }
                                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer"
                                  >
                                    <svg
                                      className="w-8 h-8 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                      {feature.id === 4 && (
                        <SousSlider
                          items={moreFeaturesCarouselData}
                          isOpen={isMoreFeaturesCarouselOpen}
                          onClose={() =>
                            setIsMoreFeaturesCarouselOpen(false)
                          }
                          cardWidth="320px"
                          language={language}
                          itemsPerView={3}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="flex justify-center mt-6 md:mt-8">
                <div className="flex md:hidden items-center justify-center gap-2">
                  {convenienceFeatures.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentConvenienceCard(index)}
                      className={`transition-all duration-300 rounded-full ${
                        currentConvenienceCard === index
                          ? "w-2.5 h-2.5 bg-white"
                          : "w-2 h-2 bg-white/40"
                      }`}
                      aria-label={`Go to card ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="hidden md:block">
                  <CarouselNavigation
                    currentIndex={currentConvenienceCard}
                    totalItems={convenienceFeatures.length}
                    itemsPerView={3}
                    showPerCard={true}
                    onSlideChange={(index) => {
                      if (isMoreFeaturesCarouselOpen) {
                        setIsMoreFeaturesCarouselOpen(false);
                      }
                      setCurrentConvenienceCard(index);
                    }}
                    onPrevious={prevConvenienceCard}
                    onNext={nextConvenienceCard}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 8: Performance Features - Horizontal Card Slider */}
        <section className="relative py-20 bg-black overflow-hidden w-full">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-white text-sm font-light mb-2">
              {language === "fr" ? "PERFORMANCE" : "PERFORMANCE"}
            </h2>
            <h1
              style={{
                fontSize: "24px",
                fontFamily: "inherit",
                lineHeight: "1.2",
                fontWeight: "700",
                margin: 0,
                padding: 0,
                color: "white",
              }}
            >
              {language === "fr"
                ? "Votre allié, entre puissance et agilité"
                : "Your ally, between power and agility"}
            </h1>
          </div>

          {/* Horizontal Card Slider Container */}
          <div className="relative max-w-7xl mx-auto px-0 md:px-4 w-full overflow-hidden">
            {/* Cards Container */}
            <div className="relative overflow-hidden w-full">
              <div
                className="flex transition-transform duration-700 ease-out performance-slider w-full"
                style={{
                  transform: isMobile
                    ? currentPerformanceCard === 0
                      ? "translateX(0%)"
                      : `translateX(calc(-${8 + currentPerformanceCard * 69}%))`
                    : `translateX(-${currentPerformanceCard * (100 / 3)}%)`,
                }}
                onTouchStart={onPerformanceTouchStart}
                onTouchMove={onPerformanceTouchMove}
                onTouchEnd={onPerformanceTouchEnd}
              >
                {performanceFeatures.map((feature, index) => (
                  <div
                    key={feature.id}
                    className="performance-card flex-shrink-0 w-[65%] md:w-[33.333%] mr-[4%] md:mr-0 md:px-4"
                    style={{ marginLeft: index === 0 && isMobile ? "8%" : "0" }}
                  >
                    <div className="slide-item-wrap">
                      <div
                        className="gallery-wrap rounded-lg overflow-hidden relative"
                        style={{ height: isMobile ? "450px" : "514px" }}
                      >
                        {/* Background Image or Video */}
                        {(feature as { video?: string }).video &&
                        playingVideo === (feature as { video?: string }).video &&
                        videoPlaying ? (
                          <video
                            src={(feature as { video?: string }).video}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                          />
                        ) : (
                          <Image
                            src={feature.image}
                            alt={feature.subtitle}
                            fill
                            className="object-cover"
                            quality={90}
                          />
                        )}

                        {/* Gradient Overlay - Top and Bottom Shadow */}
                        <div
                          className="absolute inset-0 z-[5] pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.5) 100%)",
                          }}
                        />

                        {/* Text Box - Hidden when video is playing */}
                        {!(
                          (feature as { video?: string }).video &&
                          playingVideo === (feature as { video?: string }).video &&
                          videoPlaying
                        ) && (
                          <div className="text-box absolute inset-0 p-6 md:p-8 flex flex-col justify-between z-10">
                            {/* Tagline (em) + card title */}
                            <div className="flex flex-col backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                              <em
                                className={`${feature.textColor} text-sm font-light italic mb-2 drop-shadow-lg block`}
                              >
                                {feature.title}
                              </em>
                              <h2
                                className={`${feature.subtitleColor} text-xl md:text-2xl font-bold mb-3 md:mb-4 drop-shadow-lg`}
                              >
                                {feature.subtitle}
                              </h2>
                              {feature.hasOpenButton && (
                                <button className="bg-kgm-amber text-black w-10 h-10 rounded-full font-semibold hover:bg-kgm-amber/80 transition-colors duration-300 flex items-center justify-center">
                                  <span className="text-lg">+</span>
                                </button>
                              )}
                            </div>

                            {/* Description - always at bottom */}
                            <div className="flex flex-col items-start backdrop-blur-sm bg-black/10 rounded-lg p-3 md:p-4">
                              <p
                                className={`${feature.textColor} text-sm leading-relaxed mb-4 drop-shadow-lg text-left`}
                                dangerouslySetInnerHTML={{
                                  __html: feature.description,
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Video Play/Stop Button - only when feature has video */}
                        {(feature as { video?: string }).video && (
                          <div className="absolute bottom-6 right-6 z-20">
                            <button
                              type="button"
                              aria-label="Toggle video playback"
                              title="Toggle video playback"
                              onClick={() =>
                                toggleVideo(
                                  (feature as { video?: string }).video!
                                )
                              }
                              className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 cursor-pointer"
                            >
                              {playingVideo ===
                                (feature as { video?: string }).video &&
                              videoPlaying ? (
                                <svg
                                  className="w-8 h-8 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                                </svg>
                              ) : (
                                <svg
                                  className="w-8 h-8 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Component */}
            <div className="flex justify-center mt-6 md:mt-8">
              {/* Simple dots navigation for mobile - hidden on desktop */}
              <div className="flex md:hidden items-center justify-center gap-2">
                {performanceFeatures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPerformanceCard(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentPerformanceCard === index
                        ? "w-2.5 h-2.5 bg-white"
                        : "w-2 h-2 bg-white/40"
                    }`}
                    aria-label={`Go to card ${index + 1}`}
                  />
                ))}
              </div>
              {/* Desktop navigation - hidden on mobile */}
              <div className="hidden md:block">
                <CarouselNavigation
                  currentIndex={currentPerformanceCard}
                  totalItems={performanceFeatures.length}
                  itemsPerView={3}
                  showPerCard={true}
                  onSlideChange={setCurrentPerformanceCard}
                  onPrevious={prevPerformanceCard}
                  onNext={nextPerformanceCard}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 9: Download Brochure */}
        <section className="relative py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col items-center justify-center">
              {/* Download Button */}
              <a
                href="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/DPR-KGM-Fiche%20Technique%20TORRES%20HEV%20VERSO%20EXE%20%20(1)_compressed.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 px-10 py-5 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {/* Download Icon */}
                <svg
                  className="w-6 h-6 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span className="whitespace-nowrap">
                  {language === "fr"
                    ? "Téléchargez votre brochure"
                    : "Download your brochure"}
                </span>
              </a>
            </div>
          </div>
        </section>
      </section>

      <Footer />
    </div>
  );
};

export default TorresHybridPage;
