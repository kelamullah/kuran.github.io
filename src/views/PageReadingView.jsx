import { Fragment, memo, useCallback, useMemo, useState } from 'react';

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

const ChevronRight = createIcon('<path d="m9 18 6-6-6-6"/>');
const ChevronLeft = createIcon('<path d="m15 18-6-6 6-6"/>');
const Hash = createIcon('<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>');
const FileText = createIcon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>');
const Copy = createIcon('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>');
const Check = createIcon('<polyline points="20 6 9 17 4 12"/>');

const FONT_SIZES = {
  arabic: ['text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'],
  translation: ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl']
};

const toArabicNumber = (num) => {
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map((digit) => arabicNumbers[parseInt(digit)])
    .join('');
};

const VerseCard = memo(({ verse, navigateTo, surahId, verseNum, hideActions = false, sizes, onPrefetchVerseDetail }) => {
  const [copied, setCopied] = useState(false);
  const { arabicSize, transSize, arabicFontClass } = sizes;

  const copyToClipboard = useCallback(async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {}
  }, []);

  const handleDetailClick = useCallback(() => {
    navigateTo({ type: 'verse_detail', surahId, verseNum });
  }, [navigateTo, surahId, verseNum]);

  const translationText = verse.translation?.text || (typeof verse.translation === 'string' ? verse.translation : 'Çeviri yüklenemedi.');
  const formattedTranslation = useMemo(
    () => translationText.replace(/<mark>/g, '<mark class="bg-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-100 text-emerald-950 px-1.5 rounded-md">'),
    [translationText]
  );

  return (
    <div className="bg-white dark:bg-slate-900/80 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow mb-6 group border border-transparent dark:border-slate-800/50">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col items-center space-y-3">
          {verse.surah && (
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full mb-1 text-center">
              {verse.surah.name}
              <br />
              {verse.verse_number}
            </span>
          )}
          {!verse.surah && (
            <span className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 text-base font-bold shrink-0">
              {verse.verse_number}
            </span>
          )}

          <button onClick={() => copyToClipboard(verse.verse)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-full text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors" title="Arapça Metni Kopyala" aria-label="Arapça metni kopyala">
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex-1 text-right ml-6 overflow-hidden">
          <p className={`${FONT_SIZES.arabic[arabicSize]} ${arabicFontClass} leading-relaxed text-slate-900 dark:text-slate-50 transition-all`} dir="rtl">
            {verse.verse}
          </p>
        </div>
      </div>
      <div className="border-t border-slate-100 dark:border-slate-800/60 pt-6">
        <p className={`text-slate-700 dark:text-slate-300 leading-relaxed ${FONT_SIZES.translation[transSize]} transition-all`} dangerouslySetInnerHTML={{ __html: formattedTranslation }} />
      </div>

      {!hideActions && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex justify-end">
          <button onMouseEnter={onPrefetchVerseDetail} onFocus={onPrefetchVerseDetail} onClick={handleDetailClick} className="text-sm font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 px-5 py-2.5 rounded-full transition-colors">
            <FileText className="w-4 h-4" />
            <span>Analiz & Diğer Çeviriler</span>
          </button>
        </div>
      )}
    </div>
  );
});

export default function PageReadingView({ viewData, viewState, navigateTo, sizes, viewMode, onPrefetchVerseDetail }) {
  const verses = Array.isArray(viewData) ? viewData : (viewData?.verses || null);
  const groupedVerses = useMemo(() => {
    if (!verses || verses.length === 0) return [];
    const groups = [];
    verses.forEach((verse) => {
      const surahId = verse.surah?.id;
      if (!groups.length || groups[groups.length - 1].surahId !== surahId) {
        groups.push({ surahId, surah: verse.surah, zero: verse.verse_number === 1 ? verse.zero : null, verses: [] });
      }
      groups[groups.length - 1].verses.push(verse);
    });
    return groups;
  }, [verses]);

  if (!verses) return null;
  if (verses.length === 0) {
    return <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-[2.5rem] text-slate-500 dark:text-slate-400">Bu sayfa için veri bulunamadı.</div>;
  }

  let currentSurahTracker = null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 slide-up">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-10 pt-4 rounded-b-[2rem] px-4">
        <h2 className="text-2xl font-extrabold flex items-center text-slate-800 dark:text-slate-100">
          <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-full mr-3 text-emerald-700 dark:text-emerald-400">
            <Hash className="w-5 h-5" />
          </div>
          Sayfa {viewState.pageNum}
        </h2>
        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm">
          <button onClick={() => navigateTo({ type: 'page', pageNum: viewState.pageNum - 1 })} disabled={viewState.pageNum <= 1} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors" aria-label="Önceki sayfaya git"><ChevronLeft className="w-5 h-5" /></button>
          <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
          <button onClick={() => navigateTo({ type: 'page', pageNum: viewState.pageNum + 1 })} disabled={viewState.pageNum >= 604} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors" aria-label="Sonraki sayfaya git"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>

      {viewMode === 'mushaf' ? (
        <div className="mushaf-page mushaf-sheet p-8 md:p-16 rounded-[2.5rem] shadow-sm relative overflow-hidden">
          <div className="mushaf-frame absolute inset-3 md:inset-5 border-2 border-emerald-100/60 dark:border-slate-800/80 rounded-[1.5rem] pointer-events-none"></div>

          <div className="relative z-10 space-y-12">
            {groupedVerses.map((group, gIdx) => (
              <div key={group.surahId || gIdx}>
                {group.surah && (
                  <div className="mushaf-surah-head text-center mb-8 pb-8 border-b-2 border-emerald-100/50 dark:border-slate-800/80 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigateTo({ type: 'surah', surahId: group.surah.id })}>
                    <div className="mushaf-title-wrap bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200/50 dark:border-slate-700 rounded-full py-4 px-12 inline-block shadow-sm">
                      <h2 className="mushaf-title text-4xl md:text-5xl font-arabic-amiri font-bold text-emerald-950 dark:text-emerald-400">{group.surah.name_original}</h2>
                    </div>
                  </div>
                )}
                {group.zero && (
                  <div className="mushaf-basmalah text-center mb-10">
                    <p className={`${FONT_SIZES.arabic[sizes.arabicSize]} ${sizes.arabicFontClass} text-slate-800 dark:text-slate-200 leading-loose`} dir="rtl">{group.zero.verse}</p>
                  </div>
                )}
                <p className={`mushaf-layout ${FONT_SIZES.arabic[sizes.arabicSize]} ${sizes.arabicFontClass} text-slate-900 dark:text-slate-100 transition-all`}>
                  {group.verses.map((verse) => (
                    <Fragment key={verse.id}>
                      <span className="mushaf-word hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 cursor-pointer rounded-md transition-colors" onMouseEnter={onPrefetchVerseDetail} onFocus={onPrefetchVerseDetail} onClick={() => navigateTo({ type: 'verse_detail', surahId: group.surah?.id || verse.surah?.id, verseNum: verse.verse_number })}>
                        {verse.verse}
                      </span>
                      <span className="ayah-marker mushaf-ayah-marker text-emerald-700 dark:text-emerald-500 font-arabic-amiri font-bold text-[0.9em]">
                        ﴾{toArabicNumber(verse.verse_number)}﴿
                      </span>
                    </Fragment>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {verses.map((verse) => {
            const isNewSurah = currentSurahTracker !== verse.surah?.id;
            currentSurahTracker = verse.surah?.id;
            return (
              <Fragment key={verse.id}>
                {isNewSurah && verse.surah && (
                  <div className="text-center my-10 bg-emerald-50 dark:bg-slate-900 p-8 rounded-[2.5rem] cursor-pointer hover:bg-emerald-100 dark:hover:bg-slate-800 transition-colors" onClick={() => navigateTo({ type: 'surah', surahId: verse.surah.id })}>
                    <h2 className="text-5xl font-arabic-amiri font-bold text-emerald-950 dark:text-emerald-400 mb-3">{verse.surah.name_original}</h2>
                    <p className="text-emerald-700 dark:text-emerald-500 font-bold uppercase tracking-[0.2em] text-sm">{verse.surah.name} Suresi</p>
                  </div>
                )}
                {verse.zero && verse.verse_number === 1 && (
                  <div className="text-center mb-10 pb-8 border-b border-emerald-100/50 dark:border-slate-800">
                    <p className={`${FONT_SIZES.arabic[sizes.arabicSize]} ${sizes.arabicFontClass} text-slate-700 dark:text-slate-300 leading-loose`} dir="rtl">{verse.zero.verse}</p>
                  </div>
                )}
                <VerseCard verse={verse} navigateTo={navigateTo} surahId={verse.surah?.id} verseNum={verse.verse_number} sizes={sizes} onPrefetchVerseDetail={onPrefetchVerseDetail} />
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
