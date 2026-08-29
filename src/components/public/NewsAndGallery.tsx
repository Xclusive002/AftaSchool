import React, { useState, useEffect } from 'react';
import { 
  Calendar, Tag, ArrowRight, Image, Sparkles, 
  ChevronRight, ExternalLink, Award, Users 
} from 'lucide-react';
import { api } from '../../services/api';
import { NewsEventItem, GalleryItem } from '../../types';

export const NewsAndGallery: React.FC = () => {
  const [news, setNews] = useState<NewsEventItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [n, g] = await Promise.all([api.getNewsEvents(), api.getGallery()]);
        setNews(n);
        setGallery(g);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const filteredGallery = activeCategory === 'all' 
    ? gallery 
    : gallery.filter(g => g.category === activeCategory);

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Campus Life & Updates
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-serif tracking-tight">
          News, Events & Campus Gallery
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Stay connected with technical workshops, hackathons, guest lectures, and student projects at AITI Ilorin.
        </p>
      </div>

      {/* News & Events Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-2xl font-bold text-white font-serif">Latest Institutional News & Events</h2>
          <span className="text-xs text-slate-400">2026/2027 Academic Updates</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-xl"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-sm text-cyan-400 text-[10px] uppercase font-bold px-2.5 py-1 rounded-md border border-cyan-800/60">
                  {item.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-semibold">
                  <span>Read full dispatch</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Gallery Section */}
      <div className="space-y-6 pt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white font-serif">Campus Life & Technical Labs Gallery</h2>
            <p className="text-xs text-slate-400 mt-0.5">Explore our students, computer labs, and graduation showcases.</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {['all', 'lab', 'workshop', 'classroom', 'graduation'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-colors ${
                  activeCategory === cat
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredGallery.map((img) => (
            <div
              key={img.id}
              onClick={() => setSelectedImage(img)}
              className="group relative rounded-2xl overflow-hidden h-52 bg-slate-950 border border-slate-800 cursor-pointer shadow-lg hover:border-cyan-500/50 transition-all"
            >
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-4">
                <span className="text-[9px] uppercase font-bold text-cyan-400 block tracking-wider">{img.category}</span>
                <h4 className="text-xs font-bold text-white leading-tight">{img.title}</h4>
                <p className="text-[10px] text-slate-300 line-clamp-1 mt-0.5">{img.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4">
            <div className="relative h-72 sm:h-96">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 bg-slate-950/80 text-white w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">{selectedImage.category}</span>
              <h3 className="text-xl font-bold text-white font-serif">{selectedImage.title}</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
