"use client";

import { motion } from "framer-motion";
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { language } = useLanguage();
  
  return (
    <footer className="bg-[#2D294E] text-white">
      {/* Top Section - Home and Top */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex justify-between items-center">
            {/* Left side - Home */}
            <motion.a
              href="/"
              className="flex items-center space-x-2 cursor-pointer hover:text-white/80 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              <span className="text-sm font-medium uppercase tracking-wide">{language === 'fr' ? "ACCUEIL" : "HOME"}</span>
            </motion.a>

            {/* Right side - Top */}
            <motion.button
              className="flex items-center space-x-2 hover:text-white/80 transition-colors"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="text-sm font-medium uppercase tracking-wide">{language === 'fr' ? "HAUT" : "TOP"}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="18,15 12,9 6,15"/>
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Middle Section - Main Footer Content */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-start space-y-8 lg:space-y-6 md:space-y-0">
            {/* Left side - KGM Logo */}
            <motion.div
              className="flex flex-col space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              {/* KGM Logo */}
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

            {/* Middle section - Addresses */}
            <motion.div
              className="flex flex-col space-y-4 mt-4 md:mt-0"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">{language === 'fr' ? "NOS ADRESSES" : "OUR ADDRESSES"}</h3>
              <div className="flex flex-col space-y-4 text-sm text-white/80">
                <div>
                  <p className="font-semibold mb-1">{language === 'fr' ? "Casablanca :" : "Casablanca:"}</p>
                  <p className="text-white/70">1 Place Bandoeng, Casablanca 20250</p>
                  <p className="text-white/70">N°1 RDC, Bd Abdellah Ibrahimi, Zone Industrielle, Hay hassani, Casablanca 20190</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">
                    {language === 'fr' ? "Rabat :" : "Rabat:"} 
                  </p>
                  <p className="text-white/70">457 Bd Hassan II, Résidence Meryem Agdal Rabat</p>
                </div>
                <div>
                  <p className="font-semibold mb-1">Lissasfa:</p>
                  <p className="text-white/70">Km9, route d&apos;el jadida</p>
                </div>
              </div>
            </motion.div>

            {/* Right side - Social Media Icons */}
            <motion.div
              className="flex flex-col space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">{language === 'fr' ? "SUIVEZ-NOUS" : "FOLLOW US"}</h3>
              <div className="flex items-center space-x-4">
                {/* Facebook */}
                <motion.a
                  href="https://www.facebook.com/profile.php?id=61583629993838"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Facebook"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </motion.a>

                {/* Instagram */}
                <motion.a
                  href="https://www.instagram.com/kgm.morocco.official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Instagram"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href="https://www.linkedin.com/company/kgmmorocco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </motion.a>

                {/* YouTube */}
                <motion.a
                  href="https://www.youtube.com/@KGM.Morocco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="YouTube"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </motion.a>

                {/* TikTok */}
                <motion.a
                  href="https://www.tiktok.com/@kgm.morocco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="TikTok"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7.41a7.16 7.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.09z"/>
                  </svg>
                </motion.a>
              </div>
              
              {/* Korea Logo */}
              <div className="mt-6">
                <Image
                  src="/korea_flag.png"
                  alt="Korea Logo"
                  width={90}
                  height={45}
                  className="w-auto h-10 opacity-80 hover:opacity-100 transition-opacity"
                  priority={false}
                />
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Bottom Section - Legal Links and Copyright */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Legal Links */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          >
            <Link href="/cookies" className="text-xs text-white/70 hover:text-white/90 transition-colors">{language === 'fr' ? "POLITIQUE DES COOKIES" : "COOKIES POLICY"}</Link>
            <span className="text-white/30">|</span>
            <Link href="/privacy-policy" className="text-xs text-white/70 hover:text-white/90 transition-colors">{language === 'fr' ? "POLITIQUE DE CONFIDENTIALITÉ" : "PRIVACY POLICY"}</Link>
          </motion.div>

          {/* Right side - Copyright */}
          <motion.div
            className="text-xs text-white/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          >
            Copyright ©️ KG MOBILITY MOROCCO
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
