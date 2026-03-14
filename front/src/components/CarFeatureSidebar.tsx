'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarFeatureSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHotspot: string | null;
  getHotspotContent: () => {
    title: string;
    subtitle?: string;
    images?: string[];
    video?: string;
    texts?: string[];
    image?: string;
  } | null | undefined;
  currentHotspotImage: number;
  setCurrentHotspotImage: (index: number) => void;
  sectionType?: 'exterior' | 'interior'; // Add section type prop
}

const CarFeatureSidebar: React.FC<CarFeatureSidebarProps> = ({
  isOpen,
  onClose,
  selectedHotspot,
  getHotspotContent,
  currentHotspotImage,
  setCurrentHotspotImage,
  sectionType = 'exterior' // Default to exterior
}) => {
  const [sectionHeight, setSectionHeight] = useState<number>(1200); // Default height to ensure sidebar is tall enough
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get the height of the section when sidebar opens
  useEffect(() => {
    if (isOpen && selectedHotspot) {
      // Add a small delay to ensure DOM is fully rendered
      const timeoutId = setTimeout(() => {
        let targetSection = null;
        
        if (sectionType === 'interior') {
          // For interior section, look for the specific first interior image
          let firstInteriorImage = document.querySelector('img[src*="20250207173930904_ci58t7.jpg"]');
          
          // If not found, look for Torres interior image
          if (!firstInteriorImage) {
            firstInteriorImage = document.querySelector('img[src*="20250224101536505_r9usZS.jpg"]');
          }
          
          // If not found, look for Musso Grand interior image
          if (!firstInteriorImage) {
            firstInteriorImage = document.querySelector('img[src*="GRANDMUSSO/section5/1.jpg"]');
          }
          
          if (firstInteriorImage) {
            // Get the div with relative positioning that contains the image and hotspots (the direct parent container)
            let parentDiv = firstInteriorImage.closest('div.relative');
            // Navigate up to find the div that contains both the image and the sidebar
            while (parentDiv && parentDiv !== document.body) {
              const hasHotspots = parentDiv.querySelector('button[class*="bg-kgm-amber"]') || 
                                 parentDiv.querySelector('[class*="hotspot"]');
              if (hasHotspots) {
                targetSection = parentDiv;
                break;
              }
              parentDiv = parentDiv.parentElement?.closest('div.relative') || null;
            }
            // If still not found, use the immediate parent div.relative
            if (!targetSection) {
              targetSection = firstInteriorImage.closest('div.relative');
            }
            console.log('Found first interior image:', firstInteriorImage);
            console.log('Image parent container:', targetSection);
          }
          
          // If not found by specific image, look for the section with interior content
          if (!targetSection) {
            const sections = Array.from(document.querySelectorAll('section'));
            for (const section of sections) {
              const text = section.textContent || '';
              if (text.includes('INTERIOR') && (text.includes('FEATURES') || text.includes('COLORS') || text.includes('HABITACLE') || text.includes('ÉQUIPEMENTS'))) {
                targetSection = section;
                break;
              }
            }
          }
          
          // If still not found, look for section with interior images
          if (!targetSection) {
            const sections = Array.from(document.querySelectorAll('section'));
            for (const section of sections) {
              const images = section.querySelectorAll('img[src*="section5"]');
              if (images.length > 0) {
                targetSection = section;
                break;
              }
            }
          }
        } else {
          // For exterior section, use the existing logic
          // First try: Look for the section that contains the clicked hotspot
          const hotspotElements = Array.from(document.querySelectorAll('[data-hotspot-id], [id*="hotspot"], .hotspot'));
          for (const hotspot of hotspotElements) {
            if (hotspot.id === selectedHotspot || hotspot.getAttribute('data-hotspot-id') === selectedHotspot) {
              targetSection = hotspot.closest('section');
              if (targetSection) break;
            }
          }
          
          // Second try: Look for section with "EXTERIOR" text content
          if (!targetSection) {
            const sections = Array.from(document.querySelectorAll('section'));
            for (const section of sections) {
              const text = section.textContent || '';
              if (text.includes('EXTERIOR') && (text.includes('SPIRIT') || text.includes('HERITAGE'))) {
                targetSection = section;
                break;
              }
            }
          }
          
          // Third try: Look for section with specific class pattern
          if (!targetSection) {
            targetSection = document.querySelector('section[class*="min-h-[800px]"]');
          }
          
          // Fourth try: Look for section with gradient background and relative positioning
          if (!targetSection) {
            const allSections = Array.from(document.querySelectorAll('section'));
            for (const section of allSections) {
              const computedStyle = window.getComputedStyle(section);
              if (computedStyle.background.includes('gradient') && 
                  section.classList.contains('relative') && 
                  section.classList.contains('overflow-hidden')) {
                targetSection = section;
                break;
              }
            }
          }
        }
        
        if (targetSection) {
          const rect = targetSection.getBoundingClientRect();
          console.log(`Found ${sectionType} target:`, targetSection);
          console.log('Target classes:', targetSection.className);
          console.log('Target height:', rect.height);
          console.log('Target position:', rect.top, rect.bottom);
          console.log('Viewport height:', window.innerHeight);
          
          if (sectionType === 'interior') {
            // For interior, use the exact height of the container div (not the section)
            // The container div should have h-[35vh] on mobile and h-screen on desktop
            // Use the actual bounding rect height, but limit to viewport if needed
            const viewportHeight = window.innerHeight;
            // On mobile, the container is 35vh, on desktop it's h-screen (100vh)
            const isMobileView = window.innerWidth < 768;
            const calculatedHeight = isMobileView 
              ? Math.min(rect.height, viewportHeight * 0.35) // 35vh on mobile
              : Math.min(rect.height, viewportHeight); // h-screen on desktop
            console.log('Setting interior sidebar height to:', calculatedHeight, '(container:', rect.height, ', viewport:', viewportHeight, ', isMobile:', isMobileView, ')');
            setSectionHeight(calculatedHeight);
          } else {
            // For exterior, add some padding
            console.log('Setting exterior sidebar height to:', rect.height + 100);
            setSectionHeight(Math.max(rect.height, 400));
          }
        } else {
          console.log(`${sectionType} target not found, using viewport height`);
          setSectionHeight(window.innerHeight); // Use viewport height as default
        }
      }, 100); // 100ms delay to ensure DOM is ready
      
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, selectedHotspot, sectionType]);

  console.log('CarFeatureSidebar render - isOpen:', isOpen, 'selectedHotspot:', selectedHotspot);
  
  if (!isOpen || !selectedHotspot) {
    console.log('CarFeatureSidebar not rendering - isOpen:', isOpen, 'selectedHotspot:', selectedHotspot);
    return null;
  }

  const content = getHotspotContent();
  console.log('CarFeatureSidebar content:', content);
  if (!content) {
    console.log('CarFeatureSidebar not rendering - no content');
    return null;
  }

  const totalItems = (content.video ? 1 : 0) + (content.images?.length || 0) + (content.image ? 1 : 0);

  const nextImage = () => {
    if (totalItems > 1) {
      setCurrentHotspotImage((currentHotspotImage + 1) % totalItems);
    }
  };

  const prevImage = () => {
    if (totalItems > 1) {
      setCurrentHotspotImage(currentHotspotImage === 0 ? totalItems - 1 : currentHotspotImage - 1);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Side Menu Panel */}
          <motion.div
            key="sidebar-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`absolute right-0 top-0 w-full md:w-[500px] bg-white shadow-2xl z-40 flex items-center justify-center ${
              isMobile && sectionType === 'exterior' ? 'h-screen' : ''
            }`}
            style={{
              height: isMobile && sectionType === 'exterior'
                ? '100vh' // Full viewport height on mobile for exterior
                : sectionType === 'interior' 
                  ? `${Math.min(sectionHeight || 400, window.innerHeight)}px` // Use min of section height and viewport height
                  : `${Math.max(sectionHeight + 200, 1000)}px`, // Add padding for exterior
              maxHeight: sectionType === 'interior' ? `${window.innerHeight}px` : 'none', // Limit to viewport height for interior
              minHeight: isMobile 
                ? (sectionType === 'interior' ? '300px' : '100vh') 
                : (sectionType === 'interior' ? '400px' : '1000px'), // Full viewport for mobile exterior
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 md:top-4 md:right-4 w-6 h-6 md:w-8 md:h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
        >
          <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Centered Content */}
        <div className={`absolute inset-0 flex flex-col items-center ${
          isMobile && sectionType === 'exterior' ? 'justify-start px-4' : 'justify-center'
        } bg-white p-0`}
        style={isMobile && sectionType === 'exterior' ? { top: '15%' } : {}}
        >
          {/* Media Display - Centered (min-height so video area never collapses) */}
          <div className="flex flex-none items-center justify-center w-full p-0 min-h-[200px] md:min-h-[400px]">
            <div className={`relative w-full overflow-hidden px-2 md:px-4 flex items-center justify-center ${
              isMobile && sectionType === 'exterior' ? 'h-[150px] min-h-[150px] max-w-[75%]' : 'h-[250px] md:h-[500px] min-h-[250px] md:min-h-[500px]'
            }`}>
              {/* Show video first if it exists */}
              {content.video && currentHotspotImage === 0 && (
                <figure className="w-full h-full min-h-[180px] md:min-h-[400px] flex items-center justify-center bg-black/5 rounded-lg">
                  <video
                    key={content.video}
                    src={content.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full min-h-[180px] md:min-h-[400px] object-contain block"
                  />
                </figure>
              )}
              
              {/* Show images array */}
              {content.images && content.images.length > 0 && currentHotspotImage >= (content.video ? 1 : 0) && (
                <img
                  src={content.images[currentHotspotImage - (content.video ? 1 : 0)]}
                  alt={content.title}
                  className="w-full h-full object-contain"
                />
              )}
              
              {/* Fallback to single image - only show if no video and no images array */}
              {!content.video && (!content.images || content.images.length === 0) && content.image && (
                <img
                  src={content.image}
                  alt={content.title}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Navigation arrows */}
              {totalItems > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className={`absolute top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors ${
                      isMobile && sectionType === 'exterior' 
                        ? 'left-1 w-4 h-4' 
                        : 'left-1 md:left-2 w-6 h-6 md:w-8 md:h-8'
                    }`}
                  >
                    <svg className={`${isMobile && sectionType === 'exterior' ? 'w-2 h-2' : 'w-3 h-3 md:w-4 md:h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className={`absolute top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors ${
                      isMobile && sectionType === 'exterior' 
                        ? 'right-1 w-4 h-4' 
                        : 'right-1 md:right-2 w-6 h-6 md:w-8 md:h-8'
                    }`}
                  >
                    <svg className={`${isMobile && sectionType === 'exterior' ? 'w-2 h-2' : 'w-3 h-3 md:w-4 md:h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Pagination scroll type */}
              {totalItems > 1 && (
                <div className={`absolute left-1/2 transform -translate-x-1/2 flex items-center ${
                  isMobile && sectionType === 'exterior' 
                    ? 'bottom-1 space-x-0.5' 
                    : 'bottom-2 md:bottom-4 space-x-1 md:space-x-2'
                }`}>
                  {Array.from({ length: totalItems }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentHotspotImage(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentHotspotImage 
                          ? isMobile && sectionType === 'exterior'
                            ? 'w-3 h-0.5 bg-white'
                            : 'w-6 h-1.5 md:w-8 md:h-2 bg-white'
                          : isMobile && sectionType === 'exterior'
                            ? 'w-0.5 h-0.5 bg-gray-400'
                            : 'w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 hover:bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className={`font-bold text-gray-800 text-center px-6 ${
            isMobile && sectionType === 'exterior' 
              ? 'text-base pt-4' 
              : 'text-xl md:text-2xl pt-6'
          }`}>
            {content.title}
          </h2>

          {/* Dynamic Text */}
          {content.texts && (
            <div className={`text-center px-6 pb-4 ${
              isMobile && sectionType === 'exterior' 
                ? 'max-w-[85%]' 
                : 'max-w-md'
            }`}>
              <p className={`text-gray-700 leading-relaxed ${
                isMobile && sectionType === 'exterior' 
                  ? 'text-sm' 
                  : 'text-base md:text-lg'
              }`}>
                {content.texts[currentHotspotImage] || content.texts[0] || ''}
              </p>
            </div>
          )}
        </div>
      </motion.div>
      </>
      )}
    </AnimatePresence>
  );
};

export default CarFeatureSidebar;
