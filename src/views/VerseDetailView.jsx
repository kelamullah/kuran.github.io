import { useEffect, useMemo, useState } from 'react';

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

const ChevronLeft = createIcon('<path d="m15 18-6-6 6-6"/>');
const Globe = createIcon('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>');
const Type = createIcon('<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>');
const Layers = createIcon('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>');

const FONT_SIZES = {
  arabic: ['text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'],
  translation: ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl']
};

export default function VerseDetailView({ viewData, viewState, navigateTo, sizes }) {
  const [activeTab, setActiveTab] = useState('translations');
  const [revealedDetailKey, setRevealedDetailKey] = useState('');

  const tabs = useMemo(
    () => [
      { id: 'translations', label: 'Tüm Çeviriler', icon: <Globe className="w-5 h-5" /> },
      { id: 'words', label: 'Kelime Kelime', icon: <Type className="w-5 h-5" /> },
      { id: 'grammar', label: 'Gramer', icon: <Layers className="w-5 h-5" /> }
    ],
    []
  );

  const compactArabicSize = useMemo(() => Math.max(0, sizes.arabicSize - 1), [sizes.arabicSize]);
  const detailKey = `${viewState?.surahId || 0}:${viewState?.verseNum || 0}`;
  const showSecondaryContent = revealedDetailKey === detailKey;

  useEffect(() => {
    if (!viewData || !viewData.fullVerse) return;
    const idleCallback = window.requestIdleCallback;

    if (typeof idleCallback === 'function') {
      const handle = idleCallback(() => setRevealedDetailKey(detailKey), { timeout: 250 });
      return () => window.cancelIdleCallback?.(handle);
    }

    const timer = window.setTimeout(() => setRevealedDetailKey(detailKey), 120);
    return () => window.clearTimeout(timer);
  }, [detailKey, viewData]);

  const handleTabChange = (tabId) => setActiveTab(tabId);

  if (!viewData || !viewData.fullVerse) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 slide-up">
      <button onClick={() => navigateTo({ type: 'surah', surahId: viewState.surahId })} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 mb-8 font-bold transition-all bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-sm">
        <ChevronLeft className="w-5 h-5" /> <span>Sureye Dön</span>
      </button>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm p-8 md:p-10 mb-8 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest rounded-full cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-800/80 transition-colors shadow-sm" onClick={() => navigateTo({ type: 'surah', surahId: viewData.fullVerse?.surah?.id || viewState.surahId })}>
          {viewData.fullVerse?.surah?.name ? `${viewData.fullVerse.surah.name}, ` : `${viewState.surahId}. Sure, `}{viewData.fullVerse?.verse_number || viewState.verseNum}. Ayet
        </div>
        <p className={`${FONT_SIZES.arabic[compactArabicSize]} ${sizes.arabicFontClass} leading-loose text-slate-900 dark:text-white mt-6 transition-all`} dir="rtl">{viewData.fullVerse?.verse}</p>
      </div>

      <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-full mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex-1 flex items-center justify-center space-x-2 py-3.5 px-4 text-sm font-bold rounded-full transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {!showSecondaryContent && (
        <div className="space-y-4 animate-pulse">
          <div className="h-28 rounded-[2rem] bg-white dark:bg-slate-900/80"></div>
          <div className="h-28 rounded-[2rem] bg-white dark:bg-slate-900/80"></div>
        </div>
      )}

      {showSecondaryContent && <div className="space-y-6">
        {activeTab === 'translations' && (
          <div className="grid gap-4">
            {viewData.translations.map((t, idx) => (
              <div key={idx} className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-transparent dark:border-slate-800/50 hover:shadow-md transition-shadow">
                <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-4 bg-emerald-50 dark:bg-emerald-900/20 inline-block px-3 py-1.5 rounded-full">{t.author?.name || t.author}</h4>
                <p className={`text-slate-800 dark:text-slate-200 leading-relaxed ${FONT_SIZES.translation[sizes.transSize]} transition-all`}>{t.text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'words' && (
          <div className="flex flex-wrap flex-row-reverse gap-4 justify-start">
            {viewData.words?.map((w, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 text-center shadow-sm min-w-[160px] flex-1 sm:flex-none hover:shadow-md transition-all border border-transparent dark:border-slate-800/50">
                <span className={`${FONT_SIZES.arabic[sizes.arabicSize - 1 < 0 ? 0 : sizes.arabicSize - 1]} ${sizes.arabicFontClass} mb-5 block text-slate-900 dark:text-white transition-all`} dir="rtl">{w.arabic || w.word}</span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-full block truncate">{w.translation_tr || w.translation}</span>
              </div>
            ))}
            {(!viewData.words || viewData.words.length === 0) && <div className="text-center w-full py-20 text-slate-400 font-medium">Bu veri henüz eklenmemiş.</div>}
          </div>
        )}

        {activeTab === 'grammar' && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-transparent dark:border-slate-800/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <th className="p-6">Kelime</th><th className="p-6">Meali</th><th className="p-6">Gramer Analizi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                  {viewData.verseparts?.map((vp, idx) => {
                    const detailGroups = Array.isArray(vp.details) ? vp.details : [];
                    const hasDetailGroups = detailGroups.length > 0;
                    return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className={`${FONT_SIZES.arabic[sizes.arabicSize - 1 < 0 ? 0 : sizes.arabicSize - 1]} ${sizes.arabicFontClass} p-6 text-slate-900 dark:text-white transition-all`} dir="rtl">{vp.arabic}</td>
                      <td className="p-6 text-base font-bold text-emerald-700 dark:text-emerald-400">{vp.translation_tr}</td>
                      <td className="p-6">
                        {hasDetailGroups ? (
                          detailGroups.map((group, gIdx) => (
                            <div key={gIdx} className="flex flex-wrap gap-2 mb-1.5">
                              {Array.isArray(group) ? group.map((d, dIdx) => (
                                <span key={dIdx} className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full">{d.tr}</span>
                              )) : null}
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {vp.root?.arabic && <span className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full">Kök: {vp.root.arabic}</span>}
                            {vp.root?.latin && <span className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full">Latin: {vp.root.latin}</span>}
                            {vp.transcription_tr && <span className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full">Okunuş: {vp.transcription_tr}</span>}
                            {!vp.root?.arabic && !vp.root?.latin && !vp.transcription_tr && <span className="text-sm text-slate-400 dark:text-slate-500">Detay bulunmuyor.</span>}
                          </div>
                        )}
                      </td>
                    </tr>
                  );})}
                  {(!viewData.verseparts || viewData.verseparts.length === 0) && (
                    <tr><td colSpan="3" className="p-12 text-center text-slate-400 dark:text-slate-500 font-medium">Bu ayet için gramer verisi bulunmuyor.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>}
    </div>
  );
}
