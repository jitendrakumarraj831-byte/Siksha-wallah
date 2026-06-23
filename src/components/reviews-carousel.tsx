"use client";

import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimateIn } from "./animate-in";

interface Review {
  name: string;
  course: string;
  place: string;
  text: string;
  avatar: string;
}

interface ReviewsCarouselProps {
  reviews: readonly Review[] | Review[];
  title?: string;
  subtitle?: string;
}

export function ReviewsCarousel({
  reviews,
  title = "सफलता की कहानियाँ",
  subtitle = "हमारे 5,000+ सफल छात्रों के अनुभव सुनें",
}: ReviewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, reviews.length]);

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const handleDotClick = (index: number) => {
    setIsAutoPlay(false);
    setCurrentIndex(index);
  };

  const currentReview = reviews[currentIndex];

  return (
    <section className="py-24 bg-gradient-to-br from-[#00102e] via-[#001850] to-[#003590] text-white overflow-hidden">
      <div className="container-shell">
        {/* Header */}
        <AnimateIn type="fade-up" className="text-center mb-16">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-400 mb-2">
            Success Stories
          </p>
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-4">
            {title}
          </h2>
          <p className="max-w-2xl mx-auto text-blue-200 leading-relaxed">
            {subtitle}
          </p>
        </AnimateIn>

        {/* Carousel Container */}
        <div className="relative max-w-3xl mx-auto">
          {/* Carousel Slide */}
          <AnimateIn type="fade-up" key={currentIndex} duration={400}>
            <article className="group relative flex flex-col rounded-3xl border border-white/[0.1] bg-white/[0.05] p-8 md:p-12 backdrop-blur-sm transition-all duration-300 min-h-[420px] md:min-h-[380px]">
              {/* Decorative quote */}
              <div className="select-none font-serif text-6xl leading-none text-amber-400/30 mb-4">
                &ldquo;
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 text-amber-400 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} fill="currentColor" />
                ))}
              </div>

              {/* Review text */}
              <p className="flex-1 text-base md:text-lg leading-[1.8] text-blue-100 font-medium">
                {currentReview.text}
              </p>

              {/* Divider */}
              <div className="mt-8 border-t border-white/[0.1] pt-6">
                {/* Footer with avatar */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${currentReview.avatar} text-lg font-bold text-white shadow-lg`}
                  >
                    {currentReview.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline font-extrabold text-white text-lg truncate">
                      {currentReview.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="rounded-full border border-amber-400/30 bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300">
                        {currentReview.course}
                      </span>
                      <span className="text-xs text-blue-300">{currentReview.place}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </AnimateIn>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              onClick={handlePrev}
              aria-label="Previous review"
              className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white/[0.1] border border-white/[0.2] text-white hover:bg-white/[0.15] transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dot Indicators */}
            <div className="flex gap-2 justify-center flex-1">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  aria-label={`Go to review ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-amber-400 w-8"
                      : "bg-white/[0.2] w-2 hover:bg-white/[0.3]"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              aria-label="Next review"
              className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-white/[0.1] border border-white/[0.2] text-white hover:bg-white/[0.15] transition-all duration-300 hover:shadow-lg hover:shadow-amber-400/20"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Counter */}
          <div className="mt-6 text-center text-sm text-blue-300">
            {currentIndex + 1} / {reviews.length}
          </div>
        </div>
      </div>
    </section>
  );
}
