'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, ChevronDown, Globe, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import enTranslations from '@/messages/en.json';
import frTranslations from '@/messages/fr.json';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInHeroSection, setIsInHeroSection] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isPhonePopupOpen, setIsPhonePopupOpen] = useState(false);
  const [isBrandNewsHovered, setIsBrandNewsHovered] = useState(false);
  const [isModelsExpanded, setIsModelsExpanded] = useState(false);
  const [brandHoverTimeout, setBrandHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const phonePopupRef = useRef<HTMLDivElement>(null);
  const { language, toggleLanguage } = useLanguage();
  const pathname = usePathname();
  
  // Check if we're on the homepage
  const isHomepage = pathname === '/' || pathname === '';
  
  // Get current translations based on language
  const t = language === 'fr' ? frTranslations : enTranslations;

  const leftMenuItems = [
    { name: (t as any)?.navigation?.models || "MODELS", href: '/models' },
    { name: (t as any)?.navigation?.contactUs || "CONTACT US", href: '/contact-us' },
    { name: (t as any)?.navigation?.myOrders || "MY ORDERS", href: '/my-orders' },
  ];

  const rightMenuItems = [];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
      
      // Check if we're still in the hero section (for video background on homepage)
      if (isHomepage) {
        const heroHeight = window.innerHeight;
        setIsInHeroSection(scrollTop <= heroHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu') && !target.closest('.hamburger-button')) {
        setIsMobileMenuOpen(false);
        setIsModelsExpanded(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close models dropdown when mobile menu closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsModelsExpanded(false);
    }
  }, [isMobileMenuOpen]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(target)) {
        setIsLanguageDropdownOpen(false);
      }
      if (phonePopupRef.current && !phonePopupRef.current.contains(target)) {
        setIsPhonePopupOpen(false);
      }
    };

    if (isLanguageDropdownOpen || isPhonePopupOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLanguageDropdownOpen, isPhonePopupOpen]);

  // Handle search modal
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close search modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSearchOpen]);

  // Available models for search
  const models = [
    { name: language === 'fr' ? 'Torres' : 'Torres', href: '/models/torres' },
    { name: language === 'fr' ? 'Torres EVX' : 'Torres EVX', href: '/models/torres-evx' },
    { name: language === 'fr' ? 'Torres Hybrid' : 'Torres Hybrid', href: '/models/torres-hybrid' },
    { name: language === 'fr' ? 'Tivoli' : 'Tivoli', href: '/models/tivoli' },
    { name: language === 'fr' ? 'Rexton' : 'Rexton', href: '/models/rexton' },
    { name: language === 'fr' ? 'Musso Grand' : 'Musso Grand', href: '/models/musso-grand' },
  ];

  // Filter models based on search query
  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return models;
    const query = searchQuery.toLowerCase();
    return models.filter(model => 
      model.name.toLowerCase().includes(query)
    );
  }, [searchQuery, language]);

  // Handle brand hover with timeout - only for BRAND item
  const handleBrandMouseEnter = (event: React.MouseEvent) => {
    const target = event.currentTarget as HTMLElement;
    const isBrandItem = target.getAttribute('data-menu-item') === 'brand';
    
    // Only show dropdown if hovering over BRAND item specifically
    if (isBrandItem) {
      if (brandHoverTimeout) {
        clearTimeout(brandHoverTimeout);
      }
      setBrandHoverTimeout(setTimeout(() => {
        setIsBrandNewsHovered(true);
      }, 150));
    }
  };

  const handleBrandMouseLeave = () => {
    if (brandHoverTimeout) {
      clearTimeout(brandHoverTimeout);
      setBrandHoverTimeout(null);
    }
    // Add delay before closing to allow moving to dropdown
    setBrandHoverTimeout(setTimeout(() => {
      setIsBrandNewsHovered(false);
    }, 200));
  };

  const handleDropdownMouseEnter = () => {
    if (brandHoverTimeout) {
      clearTimeout(brandHoverTimeout);
      setBrandHoverTimeout(null);
    }
    setIsBrandNewsHovered(true);
  };

  const handleDropdownMouseLeave = () => {
    if (brandHoverTimeout) {
      clearTimeout(brandHoverTimeout);
      setBrandHoverTimeout(null);
    }
    setIsBrandNewsHovered(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (brandHoverTimeout) {
        clearTimeout(brandHoverTimeout);
      }
    };
  }, [brandHoverTimeout]);


  // Navbar variants - with background color #2d294e
  const navbarVariants = useMemo(() => ({
    initial: { 
      backgroundColor: '#2d294e',
    },
    scrolled: { 
      backgroundColor: '#2d294e',
      boxShadow: 'none'
    }
  }), []);

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      backgroundColor: '#2d294e',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      backgroundColor: '#2d294e',
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const popupVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        initial="initial"
        animate={isScrolled ? "scrolled" : "initial"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-[100] h-20"
        style={{ backgroundColor: '#2d294e' }}
      >
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            
            {/* Left Menu Items - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* MODELS */}
              <motion.a
                href="/models"
                whileHover={{ y: -2 }}
                className="relative text-white font-semibold uppercase tracking-wide text-sm cursor-pointer group"
              >
                {(t as any)?.navigation?.models || "MODELS"}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>

              {/* CONTACT US */}
              <motion.a
                href="/contact-us"
                whileHover={{ y: -2 }}
                className="relative text-white font-semibold uppercase tracking-wide text-sm cursor-pointer group"
              >
                {(t as any)?.navigation?.contactUs || "CONTACT US"}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>

              {/* MY ORDERS */}
              <motion.a
                href="/my-orders"
                whileHover={{ y: -2 }}
                className="relative text-white font-semibold uppercase tracking-wide text-sm cursor-pointer group"
              >
                {(t as any)?.navigation?.myOrders || "MY ORDERS"}
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            </div>


            {/* Center Logo */}
            <motion.div 
              className="flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/" aria-label="Go to home">
                <Image
                  src="https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/hero/icon-logo-light.svg"
                  alt="KGM Logo"
                  width={100}
                  height={40}
                  className="w-auto h-7"
                  priority
                />
              </Link>
            </motion.div>

            {/* Right Menu Items & Icons - Desktop */}
            <div className="hidden lg:flex items-center space-x-8">
              {/* Phone Button */}
              <div ref={phonePopupRef} className="relative">
                <motion.button
                  onClick={() => setIsPhonePopupOpen(!isPhonePopupOpen)}
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative flex items-center justify-center cursor-pointer group"
                >
                  <Phone size={20} className="text-white group-hover:text-kgm-amber transition-colors" />
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-white"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>

                {/* Phone Popup */}
                <AnimatePresence>
                  {isPhonePopupOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-[#0b0d16] border border-white/20 rounded-lg shadow-2xl overflow-hidden z-50"
                    >
                      <a
                        href="tel:+212522928999"
                        onClick={() => setIsPhonePopupOpen(false)}
                        className="flex items-center space-x-2 px-4 py-3 text-white hover:bg-white/10 transition-colors w-full"
                      >
                        <Phone size={18} className="text-white flex-shrink-0" />
                        <span className="text-sm font-medium">05 22 92 89 99</span>
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Button */}
              <motion.button
                onClick={() => setIsSearchOpen(true)}
                whileHover={{ y: -2 }}
                className="relative flex items-center space-x-2 cursor-pointer group"
              >
                <span className="text-white font-semibold uppercase tracking-wide text-sm">{(t as any)?.navigation?.search || "SEARCH"}</span>
                <Search size={18} className="text-white" />
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>

              {/* Language Switcher - Modern Dropdown */}
              <div ref={languageDropdownRef} className="relative">
              <motion.button
                  onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                  whileHover={{ y: -2 }}
                  className="relative flex items-center space-x-2 text-white font-semibold uppercase tracking-wide text-sm cursor-pointer group"
              >
                  <Globe size={18} className="text-white" />
                  <span>{language === 'en' ? 'English' : 'Français'}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-white transition-transform duration-200 ${isLanguageDropdownOpen ? 'rotate-180' : ''}`}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-white"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.2 }}
                  />
              </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isLanguageDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 w-40 bg-[#0b0d16] border border-white/20 rounded-lg shadow-2xl overflow-hidden z-50"
                    >
                      <button
                        onClick={() => {
                          if (language !== 'en') {
                            toggleLanguage();
                          }
                          setIsLanguageDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                          language === 'en' 
                            ? 'bg-white/10 text-white' 
                            : 'text-white/80 hover:bg-white/5'
                        }`}
                      >
                        <span className="font-semibold text-sm">English</span>
                        {language === 'en' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </button>
                      <div className="h-px bg-white/10"></div>
                      <button
                        onClick={() => {
                          if (language !== 'fr') {
                            toggleLanguage();
                          }
                          setIsLanguageDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                          language === 'fr' 
                            ? 'bg-white/10 text-white' 
                            : 'text-white/80 hover:bg-white/5'
                        }`}
                      >
                        <span className="font-semibold text-sm">Français</span>
                        {language === 'fr' && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="lg:hidden text-white p-2 hamburger-button"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="lg:hidden fixed top-20 left-0 right-0 z-40 mobile-menu"
            style={{ backgroundColor: '#2d294e' }}
          >
            <div className="px-4 py-6 space-y-4">
              {leftMenuItems.map((item) => {
                // Handle MODELS with dropdown
                if (item.name === (t as any)?.navigation?.models || item.name === "MODELS" || item.name === "MODÈLES") {
                  const models = [
                    { name: (t as any)?.models?.modelNames?.tivoli || "TIVOLI", href: '/models/tivoli' },
                    { name: (t as any)?.models?.modelNames?.torres || "TORRES", href: '/models/torres' },
                    { name: (t as any)?.models?.modelNames?.torresEvx || "TORRES EVX", href: '/models/torres-evx' },
                    { name: (t as any)?.models?.modelNames?.torresHybrid || "TORRES HYBRID", href: '/models/torres-hybrid' },
                    { name: (t as any)?.models?.modelNames?.rexton || "REXTON", href: '/models/rexton' },
                    { name: (t as any)?.models?.modelNames?.mussoGrand || "GRAND MUSSO", href: '/models/musso-grand' },
                  ];
                  
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between w-full">
                        <motion.a
                          href="/models"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => {
                            // Only navigate if clicking directly on the link text, not on the chevron area
                            if ((e.target as HTMLElement).closest('button')) {
                              e.preventDefault();
                              return;
                            }
                            setIsMobileMenuOpen(false);
                            setIsModelsExpanded(false);
                          }}
                          className="flex-1 text-white font-semibold uppercase tracking-wide text-lg py-3 px-4 hover:bg-white/10 rounded-lg transition-colors pointer-events-auto"
                        >
                          {item.name}
                        </motion.a>
                        <motion.button
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.2 }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsModelsExpanded(!isModelsExpanded);
                          }}
                          className="text-white font-semibold uppercase tracking-wide text-lg py-3 px-2 hover:bg-white/10 rounded-lg transition-colors pointer-events-auto flex-shrink-0"
                        >
                          <motion.svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ rotate: isModelsExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </motion.svg>
                        </motion.button>
                      </div>
                      <AnimatePresence>
                        {isModelsExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 space-y-1">
                              {models.map((model, index) => (
                                <motion.a
                                  key={model.href}
                                  href={model.href}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setIsModelsExpanded(false);
                                  }}
                                  className="block text-white/80 font-medium uppercase tracking-wide text-base py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                  {model.name}
                                </motion.a>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }
                
                // Regular menu items
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white font-semibold uppercase tracking-wide text-lg py-3 px-4 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {item.name}
                  </motion.a>
                );
              })}
              
              {/* Mobile Phone */}
              <motion.button
                onClick={() => setIsPhonePopupOpen(!isPhonePopupOpen)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="flex items-center space-x-3 text-white py-3 px-4 hover:bg-white/10 rounded-lg transition-colors w-full"
              >
                <Phone size={20} />
                <span className="font-semibold uppercase tracking-wide text-lg">05 22 92 89 99</span>
              </motion.button>
              
              {/* Mobile Phone Popup */}
              <AnimatePresence>
                {isPhonePopupOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#0b0d16] border border-white/20 rounded-lg p-4 mt-2"
                  >
                    <a
                      href="tel:+212522928999"
                      onClick={() => {
                        setIsPhonePopupOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 text-white hover:text-kgm-amber transition-colors text-lg font-semibold"
                    >
                      <Phone size={18} />
                      <span>05 22 92 89 99</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Mobile Search */}
              <motion.button
                onClick={() => {
                  setIsSearchOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="flex items-center space-x-3 text-white py-3 px-4 hover:bg-white/10 rounded-lg transition-colors w-full"
              >
                <span className="font-semibold uppercase tracking-wide text-lg">{(t as any)?.navigation?.search || "SEARCH"}</span>
                <Search size={20} />
              </motion.button>

              {/* Mobile Language Toggle */}
              <div className="space-y-2">
                <div className="px-4 py-2">
                  <span className="text-white/60 font-medium text-xs uppercase tracking-wide">
                    {language === 'en' ? 'Language' : 'Langue'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    if (language !== 'en') {
                      toggleLanguage();
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                    language === 'en' 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <span className="font-semibold text-base">English</span>
                  {language === 'en' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </button>
                <button
                  onClick={() => {
                    if (language !== 'fr') {
                      toggleLanguage();
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                    language === 'fr' 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/80 hover:bg-white/5'
                  }`}
              >
                  <span className="font-semibold text-base">Français</span>
                  {language === 'fr' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setIsSearchOpen(false);
              setSearchQuery('');
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-16 md:top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl mx-2 md:mx-4"
            >
              <div className="bg-[#0b0d16] border border-white/20 rounded-lg shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center space-x-2 md:space-x-4 p-3 md:p-4 border-b border-white/10">
                  <Search size={20} className="text-white/60 md:w-6 md:h-6 flex-shrink-0" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === 'fr' ? 'Rechercher un modèle...' : 'Search for a model...'}
                    className="flex-1 bg-transparent text-white placeholder-white/40 outline-none text-base md:text-lg"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="text-white/60 hover:text-white transition-colors flex-shrink-0"
                  >
                    <X size={20} className="md:w-6 md:h-6" />
                  </button>
                </div>

                {/* Search Results */}
                <div className="max-h-[60vh] md:max-h-96 overflow-y-auto">
                  {filteredModels.length > 0 ? (
                    <div className="p-1 md:p-2">
                      {filteredModels.map((model, index) => (
                        <Link
                          key={model.href}
                          href={model.href}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-3 md:p-4 hover:bg-white/5 rounded-lg transition-colors cursor-pointer active:bg-white/10"
                          >
                            <div className="flex items-center space-x-2 md:space-x-3">
                              <Search size={16} className="text-white/40 md:w-[18px] md:h-[18px] flex-shrink-0" />
                              <span className="text-white font-medium text-base md:text-lg">{model.name}</span>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="p-6 md:p-8 text-center">
                      <p className="text-white/60 text-sm md:text-base">
                        {language === 'fr' 
                          ? 'Aucun modèle trouvé' 
                          : 'No models found'}
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 md:p-8 text-center">
                      <p className="text-white/60 text-sm md:text-base">
                        {language === 'fr' 
                          ? 'Tapez pour rechercher un modèle...' 
                          : 'Type to search for a model...'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar; 