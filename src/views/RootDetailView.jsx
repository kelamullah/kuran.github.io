const createIcon = (paths) => ({ className, title, onClick }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    onClick={onClick}
    dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : '') + paths }}
  />
);

const Layers = createIcon('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>');
const ArrowRight = createIcon('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>');

export default function RootDetailView({ viewData, viewState, navigateTo, sizes }) {
  if (!viewData || !viewData.detail) return null;
  const detail = Array.isArray(viewData.detail) ? viewData.detail[0] : viewData.detail;
  if (!detail) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 slide-up">
      <div className="bg-emerald-700 dark:bg-emerald-900 text-white p-10 md:p-14 rounded-[3rem] shadow-lg mb-12 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-400 dark:bg-emerald-600 rounded-full blur-[100px] opacity-30"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-emerald-200 block mb-3 bg-emerald-800/50 dark:bg-slate-900/50 w-fit px-4 py-1.5 rounded-full">Arapça Kök</span>
              <h2 className={`text-7xl md:text-8xl ${sizes.arabicFontClass} font-bold`}>{detail.arabic}</h2>
            </div>
            <div className="text-right">
              <span className="text-5xl font-bold opacity-30">{detail.latin}</span>
            </div>
          </div>
          <p className="text-emerald-50 text-xl md:text-2xl leading-relaxed font-medium mb-12">{detail.mean}</p>

          <div className="flex flex-wrap gap-4">
            {detail.diffs?.map((diff) => (
              <div key={diff.id} className="px-6 py-4 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center space-x-4 hover:bg-white/20 transition-all">
                <span className={`${sizes.arabicFontClass} text-3xl`} dir="rtl">{diff.diff}</span>
                <div className="w-px h-8 bg-white/20"></div>
                <span className="text-sm font-black text-emerald-100">{diff.count} Kez</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="font-black text-2xl text-slate-800 dark:text-slate-100 flex items-center uppercase tracking-widest pl-4">
          <Layers className="w-7 h-7 mr-3 text-emerald-600 dark:text-emerald-500" />
          Kur'an'daki Örnekler
        </h3>

        <div className="grid gap-6">
          {viewData.verses?.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-transparent dark:border-slate-800/50 relative overflow-hidden group hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full cursor-pointer hover:bg-emerald-100 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors" onClick={() => navigateTo({ type: 'surah', surahId: item.surah.id })}>
                  {item.surah.name} : {item.verse.verse_number}
                </div>
                <button onClick={() => navigateTo({ type: 'verse_detail', surahId: item.surah.id, verseNum: item.verse.verse_number })} className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors" aria-label={`${item.surah.name} ${item.verse.verse_number}. ayet detayını aç`}>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <p className={`${sizes.arabicFontClass} text-4xl text-right mb-8 leading-loose text-slate-900 dark:text-white`} dir="rtl">{item.verse.verse}</p>
              <p className="text-slate-600 dark:text-slate-300 text-lg mb-10 leading-relaxed">{item.verse.translation?.text || 'Çeviri bulunamadı.'}</p>

              <div className="p-6 bg-emerald-50/80 dark:bg-slate-800 rounded-[2rem] flex items-center justify-between border border-transparent dark:border-slate-700/50">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">Eşleşen Meali</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{item.turkish || item.translation_tr}</span>
                </div>
                <span className={`${sizes.arabicFontClass} text-5xl text-emerald-800 dark:text-emerald-400`} dir="rtl">{item.arabic}</span>
              </div>
            </div>
          ))}
          {(!viewData.verses || viewData.verses.length === 0) && (
            <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] text-slate-500 dark:text-slate-400">Bu kök için örnek ayet bulunamadı.</div>
          )}
        </div>

        {viewData.meta && viewData.meta.last_page > 1 && (
          <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-full shadow-sm mt-12">
            <button
              disabled={viewData.meta.current_page === 1}
              onClick={() => navigateTo({ type: 'root_detail', latin: viewState.latin, page: viewData.meta.current_page - 1 })}
              className="px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-full disabled:opacity-30 hover:bg-emerald-100 dark:hover:bg-slate-700 transition-all font-bold text-sm text-slate-700 dark:text-slate-300"
            >
              ÖNCEKİ
            </button>
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Sayfa {viewData.meta.current_page} / {viewData.meta.last_page}
            </span>
            <button
              disabled={viewData.meta.current_page === viewData.meta.last_page}
              onClick={() => navigateTo({ type: 'root_detail', latin: viewState.latin, page: viewData.meta.current_page + 1 })}
              className="px-8 py-4 bg-slate-100 dark:bg-slate-800 rounded-full disabled:opacity-30 hover:bg-emerald-100 dark:hover:bg-slate-700 transition-all font-bold text-sm text-slate-700 dark:text-slate-300"
            >
              SONRAKİ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
