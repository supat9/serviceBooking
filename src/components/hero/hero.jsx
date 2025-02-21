import { useState, useEffect, useCallback } from "react";

function Hero() {
  const images = [
    "src/assets/P003.png",
    "src/assets/P004.png",
    "src/assets/P005.png",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const setSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div
      id="default-carousel"
      className="relative w-full h-screen"
      data-carousel="slide"
    >
      {/* Hero Wrapper */}
      <div className="relative w-full h-full overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`${
              index === currentIndex ? "block" : "hidden"
            } duration-700 ease-in-out`}
            data-carousel-item={index === currentIndex ? "active" : ""}
          >
            <img
              src={image}
              className="absolute block w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Title */}
      <h1
        style={{
          textAlign: "center",
          fontSize: "4rem",
          fontWeight: "bold",
          color: "#fff",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textShadow: "5px 5px #b66b0a",
          zIndex: 10, // เพิ่ม zIndex เพื่อให้อยู่เหนือภาพ
        }}
      >
        Innovation of Riding
      </h1>
      <p
        style={{
          textAlign: "center",
          position: "absolute",
          top: "60%", // ปรับให้ต่ำลงจาก h1 เล็กน้อย
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: "1.25rem", // ปรับขนาดข้อความให้พอดีกับมือถือ
          zIndex: 10, // เพิ่ม zIndex เพื่อให้อยู่เหนือภาพ
        }}
        className="mt-2 text-lg md:text-xl text-zinc-300 drop-shadow-m"
      >
        Experience the power of Quick Shifter
      </p>

      <style>
        {`
        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem;
            top: 40%;
          }
          p {
            font-size: 1rem; 
            top: 50%;
          }
        }`}{" "}
      </style>

      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              index === currentIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-current={index === currentIndex}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setSlide(index)}
          ></button>
        ))}
      </div>

      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={prevSlide}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
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
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
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
