"use client";

import { motion } from "framer-motion";
import { ArrowRight, Volume2, VolumeX, Grid } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import enTranslations from '@/messages/en.json';
import frTranslations from '@/messages/fr.json';
import { useLanguage } from '@/contexts/LanguageContext';

// Image URLs - cannot import HTTPS URLs directly in Next.js
const imgTorres = "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/sections/Explore%20KGM%20Lineup/20250122154121990_f0zi96.png";
const imgTorresEvx = "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/sections/Explore%20KGM%20Lineup/20250122154005965_NqrXBm.png";
const imgTivoli = "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/sections/Explore%20KGM%20Lineup/20250122153850178_MRywMI.png";

type LineupCard = {
  id: number;
  title: string;
  headline: string;
  image: StaticImageData | string;
  href?: string;
};

const ExploreLineup = () => {
  const { language } = useLanguage();
  const [isBgmOn, setIsBgmOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  
  // Get current translations based on language
  const t = language === 'fr' ? frTranslations : enTranslations;

  const cards: LineupCard[] = [
    { id: 1, title: (t as any)?.home?.exploreLineup?.tivoli?.title || "Tivoli", headline: (t as any)?.home?.exploreLineup?.tivoli?.headline || "Urban\nAdventure", image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/1P_GEN_RHD_COVER.jpg", href: "/models/tivoli" },
    { id: 2, title: (t as any)?.home?.exploreLineup?.torres?.title || "Torres", headline: (t as any)?.home?.exploreLineup?.torres?.headline || "Unexpected\nAdventure", image: imgTorresEvx, href: "/models/torres" },
    { id: 3, title: (t as any)?.home?.exploreLineup?.torresEv?.title || "Torres EV", headline: (t as any)?.home?.exploreLineup?.torresEv?.headline || "The Best of Both\nWorld - EV & SUV", image: imgTorres, href: "/models/torres-evx" },
    { id: 4, title: (t as any)?.home?.exploreLineup?.torresHybrid?.title || "Torres Hybrid", headline: (t as any)?.home?.exploreLineup?.torresHybrid?.headline || "Dual Tech\nHybrid", image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/assets/Models/TORRESHYBRID/360vr/white/img2.png", href: "/models/torres-hybrid" },
    { id: 5, title: (t as any)?.home?.exploreLineup?.rexton?.title || "Rexton", headline: (t as any)?.home?.exploreLineup?.rexton?.headline || "Luxury\nSUV", image: "/rexton.png", href: "/models/rexton" },
    { id: 6, title: (t as any)?.home?.exploreLineup?.grandMusso?.title || "Grand Musso", headline: (t as any)?.home?.exploreLineup?.grandMusso?.headline || "Powerful\nPickup Truck", image: "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/hero/4P_EU_LHD_BLACK_EDITION_MAIN.jpg", href: "/models/musso-grand" },
  ];

  useEffect(() => {
    const audio = new Audio();
    audio.src = "https://vbcgnalssebtzofpeslx.supabase.co/storage/v1/object/public/media/media/KGM_main_sound_400k-Cd1qYekB.mp3"; // ensure file exists
    audio.preload = "auto";
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggleBgm = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      if (isBgmOn) {
        a.pause();
        setIsBgmOn(false);
      } else {
        await a.play();
        setIsBgmOn(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="relative bg-[#0b0d16] text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e1122] via-[#0b0d16] to-[#0b0d16]" />

      {/* Container at 80% width */}
      <div className="relative w-[80%] max-w-none mx-auto px-4 md:px-0 py-16 md:py-20">
        <div className="flex items-center justify-between mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#d4be83]">{(t as any)?.home?.exploreLineup?.title || "Explore KGM Lineup"}</h2>
          <a href="models" className="group inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors">
            {(t as any)?.home?.exploreLineup?.viewAllModels || "View All Models"}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Mobile/Tablet grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:hidden gap-[3px]">
          {cards.map((card, idx) => (
            <Card key={card.id} card={card} delay={idx * 0.15} t={t} />
          ))}
        </div>
      </div>

      {/* Desktop row also constrained to 80% width */}
      <div className="hidden lg:block relative w-[80%] mx-auto">
        <div
          className="flex gap-[3px]"
          onMouseLeave={() => setActiveIdx(null)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) setActiveIdx(null);
          }}
        >
          {cards.map((card, idx) => {
            const basisClass = activeIdx === null ? "basis-1/5" : activeIdx === idx ? "basis-1/2" : "basis-[12.5%]";
            return (
              <motion.article
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                tabIndex={0}
                onMouseEnter={() => setActiveIdx(idx)}
                onFocus={() => setActiveIdx(idx)}
                className={`group relative overflow-hidden rounded-none ring-0 ${basisClass} transition-[flex-basis] duration-700 ease-out`}
              >
                <CardInner card={card} t={t} />
              </motion.article>
            );
          })}
        </div>
      </div>

    </section>
  );
};

export default ExploreLineup;

function Card({ card, delay, t }: { card: LineupCard; delay: number; t: any }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay }}
      className="group relative overflow-hidden rounded-none ring-0"
    >
      <CardInner card={card} t={t} />
    </motion.article>
  );
}

function CardInner({ card, t }: { card: LineupCard; t: any }) {
  return (
    <>
      <div className="relative h-[360px] md:h-[420px] lg:h-[520px]">
        <Image
          src={card.image}
          alt={card.title}
          fill
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="text-white/80 text-sm font-semibold mb-2">{card.title}</p>
        <h3 className="text-2xl md:text-3xl font-extrabold leading-snug whitespace-pre-line">{card.headline}</h3>
        <a href={card.href ?? '#'} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white/90 hover:text-white">
          {(t as any)?.home?.exploreLineup?.learnMore || "Learn more"}
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </>
  );
}
