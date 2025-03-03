import PropTypes from "prop-types";

function News({ newsItems }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-6xl mx-auto">
      {newsItems.map((item, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
          }`}
        >
          <img
            src={item.imgSrc}
            alt={item.title}
            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
          <div className="absolute bottom-4 left-4 text-white z-10">
            <h4 className="text-xl font-semibold text-left">{item.title}</h4>
            <p className="text-gray-300 text-left">{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

const NewsSection = () => {
  const newsItems = [
    {
      title: "Quick Shifter",
      date: "January 02, 2025",
      imgSrc: "src/assets/P005.jpg",
    },
    {
      title: "Innovation of Riding",
      date: "January 02, 2025",
      imgSrc: "src/assets/P002.jpg",
    },
    {
      title: "Pay only 2,999 THB for the best experience!",
      date: "January 02, 2025",
      imgSrc: "src/assets/P004.jpg",
    },
  ];

  return (
    <div>
      <section id="news" className="bg-black py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-orange-700 text-4xl font-bold mb-8">NEWS</h2>
          <News newsItems={newsItems} />
        </div>
      </section>
      <section id="video" className="bg-orange-600 py-6"> {/* ลด py-12 เป็น py-6 */}
        <div className="flex flex-col justify-center items-center bg-orange-600 p-6 rounded-lg min-h-[500px]">
          <h3 className="text-black-700 text-4xl font-bold mb-8">WATCH OUR VIDEO</h3>
          <iframe
            width="660"
            height="415"
            src="https://www.youtube.com/embed/tnLqk7ogGeo?si=-tSV73AXgymSWJe3"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
      </section>
    </div>
  );
};

News.propTypes = {
  newsItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      imgSrc: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default NewsSection;
