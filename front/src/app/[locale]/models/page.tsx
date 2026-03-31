'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown } from 'lucide-react';
import SEO from '@/components/SEO';

// generateStaticParams() is now in the parent layout.tsx

// Note: Metadata should be added in a separate metadata export for static pages
// For client components, we use Head component or document title

interface Model {
  id: string;
  name: string;
  category: 'SUV' | 'PICKUP';
  badges: string[];
  image: string;
  isEV?: boolean;
}

export default function ModelsPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const models: Model[] = [
    {
      id: 'tivoli',
      name: t('models.modelNames.tivoli'),
      category: 'SUV',
      badges: [t('models.badges.hot')],
      image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/tivoli.png'
    },
    {
      id: 'torres',
      name: t('models.modelNames.torres'),
      category: 'SUV',
      badges: [t('models.badges.best')],
      image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/torres.png'
    },
    {
      id: 'torres-evx',
      name: t('models.modelNames.torresEvx'),
      category: 'SUV',
      badges: [t('models.badges.best')],
      image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/torresevx.png',
      isEV: true
    },
    {
      id: 'torres-hybrid',
      name: t('models.modelNames.torresHybrid'),
      category: 'SUV',
      badges: [t('models.badges.best')],
      image: '/media/hybride/IMG_7647.PNG'
    },
    {
      id: 'rexton',
      name: t('models.modelNames.rexton'),
      category: 'SUV',
      badges: [t('models.badges.best')],
      image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/rexton.png'
    },
    {
      id: 'musso-grand',
      name: t('models.modelNames.mussoGrand'),
      category: 'PICKUP',
      badges: [t('models.badges.hot')],
      image: 'https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/MUSSO%20GRAND.png'
    }
  ];

  // Show all models, no filtering
  const filteredModels = models;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="KGM Mobility Models | Tous Nos Véhicules au Maroc"
        description="Découvrez toute la gamme KGM Mobility au Maroc : Tivoli, Torres, Torres EVX, Rexton et Musso Grand. SUV et pick-up premium avec technologie avancée."
        keywords="KGM Mobility, modèles KGM, SUV Maroc, Pick-up Maroc, Tivoli, Torres, Rexton, Musso Grand"
        titleFr="KGM Mobility Models | Tous Nos Véhicules au Maroc"
        descriptionFr="Découvrez toute la gamme KGM Mobility au Maroc : Tivoli, Torres, Torres EVX, Rexton et Musso Grand. SUV et pick-up premium avec technologie avancée."
        keywordsFr="KGM Mobility, modèles KGM, SUV Maroc, Pick-up Maroc, Tivoli, Torres, Rexton, Musso Grand"
      />
      <Navbar />
      
      {/* Main Content */}
      <div className="pt-20">
        {/* Page Header */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4"
            >
              {t('models.title')}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto mb-6"
            >
              {t('models.subtitle')}
            </motion.p>
          </div>
        </div>

        {/* Models Grid - All models shown */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
          >
            {filteredModels.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">{t('models.noModels')}</p>
              </div>
            ) : (
              filteredModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden">
                  {/* Model Name */}
                  <h3 className="text-2xl md:text-3xl font-bold text-black mb-6 uppercase tracking-wide">
                    {model.name}
                  </h3>

                  {/* Car Image - Clickable for navigation */}
                  <div className="relative mb-6">
                    <motion.a
                      href={
                        model.id === 'tivoli' ? '/models/tivoli' : 
                        model.id === 'torres' ? '/models/torres' : 
                        model.id === 'torres-evx' ? '/models/torres-evx' : 
                        model.id === 'torres-hybrid' ? '/models/torres-hybrid' : 
                        model.id === 'rexton' ? '/models/rexton' : 
                        model.id === 'musso-grand' ? '/models/musso-grand' : 
                        '#'
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="block"
                    >
                      <div className="aspect-[4/3] relative overflow-hidden rounded-lg bg-gray-100 cursor-pointer">
                        <div className="absolute inset-0">
                          <Image
                            src={model.image}
                            alt={model.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      </div>
                    </motion.a>
                    
                    {/* EV Badge */}
                    {model.isEV && (
                      <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-xs font-bold">{t('models.ev')}</div>
                          <div className="text-xs">⚡</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* View Details Button */}
                    <motion.a
                      href={
                        model.id === 'tivoli' ? '/models/tivoli' : 
                        model.id === 'torres' ? '/models/torres' : 
                        model.id === 'torres-evx' ? '/models/torres-evx' : 
                        model.id === 'torres-hybrid' ? '/models/torres-hybrid' : 
                        model.id === 'rexton' ? '/models/rexton' : 
                        model.id === 'musso-grand' ? '/models/musso-grand' : 
                        '#'
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 px-6 bg-black text-white font-semibold uppercase tracking-wide rounded-lg hover:bg-gray-800 transition-all duration-300 block text-center"
                    >
                      {t('models.viewDetails')}
                    </motion.a>
                    
                    {/* Book Test Drive Button */}
                    <motion.a
                      href={`/book-test-drive?model=${model.id}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 px-6 border-2 border-black text-black font-semibold uppercase tracking-wide rounded-lg hover:bg-black hover:text-white transition-all duration-300 block text-center"
                    >
                      {language === 'fr' ? "Réservez Votre Essai" : "Book Your Test Drive"}
                    </motion.a>
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
