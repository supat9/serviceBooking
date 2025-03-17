import { useState, useEffect, useCallback } from "react";

function Hero() {
  const images = [
    "src/assets/P003.png",
    "src/assets/P004.png",
    "src/assets/P005.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("next");
  const [prevIndex, setPrevIndex] = useState(null);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection("next");
    setPrevIndex(currentIndex);
    
    const nextIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIndex);
    
    setTimeout(() => {
      setIsAnimating(false);
      setPrevIndex(null);
    }, 1000);
  }, [currentIndex, images.length, isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setDirection("prev");
    setPrevIndex(currentIndex);
    
    const prevIdx = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIdx);
    
    setTimeout(() => {
      setIsAnimating(false);
      setPrevIndex(null);
    }, 1000);
  }, [currentIndex, images.length, isAnimating]);

  const setSlide = (index) => {
    if (isAnimating || index === currentIndex) return;
    
    setIsAnimating(true);
    setDirection(index > currentIndex ? "next" : "prev");
    setPrevIndex(currentIndex);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsAnimating(false);
      setPrevIndex(null);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div
      id="default-carousel"
      className="relative w-full h-screen"
      data-carousel="slide"
    >
      {/* Hero Wrapper - Absolute positioning for all slides */}
      <div className="relative w-full h-full overflow-hidden bg-black">
        {/* Current image */}
        <div
          className={`absolute inset-0 w-full h-full transform transition-transform duration-1000 ease-in-out ${
            isAnimating && direction === "next" ? "animate-slide-in-right" : ""
          } ${
            isAnimating && direction === "prev" ? "animate-slide-in-left" : ""
          }`}
        >
          <img
            src={images[currentIndex]}
            className="absolute inset-0 block w-full h-full object-cover"
            alt={`Slide ${currentIndex + 1}`}
          />
        </div>

        {/* Previous image (only during animation) */}
        {isAnimating && prevIndex !== null && (
          <div
            className={`absolute inset-0 w-full h-full transform transition-transform duration-1000 ease-in-out ${
              direction === "next" ? "animate-slide-out-left" : ""
            } ${
              direction === "prev" ? "animate-slide-out-right" : ""
            }`}
          >
            <img
              src={images[prevIndex]}
              className="absolute inset-0 block w-full h-full object-cover"
              alt={`Slide ${prevIndex + 1}`}
            />
          </div>
        )}
      </div>

      {/* Title */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
        <h1
          className="text-4xl md:text-6xl font-bold text-white text-center transform transition-all duration-700 ease-in-out"
          style={{
            textShadow: "5px 5px #b66b0a",
          }}
        >
          Innovation of Riding
        </h1>
        <p
          className="mt-4 text-lg md:text-xl text-zinc-300 text-center drop-shadow-md transition-all duration-700 ease-in-out"
        >
          Experience the power of Quick Shifter
        </p>
      </div>

      <style>
        {`
        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem;
          }
          p {
            font-size: 1rem; 
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 1s forwards;
        }
        
        .animate-slide-out-left {
          animation: slideOutLeft 1s forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 1s forwards;
        }
        
        .animate-slide-out-right {
          animation: slideOutRight 1s forwards;
        }
        
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(100%);
          }
        }
        `}
      </style>

      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-current={index === currentIndex}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setSlide(index)}
            disabled={isAnimating}
          ></button>
        ))}
      </div>

      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={prevSlide}
        disabled={isAnimating}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none transition-all duration-300">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={nextSlide}
        disabled={isAnimating}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none transition-all duration-300">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
}

export default Hero;