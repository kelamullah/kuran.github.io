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

export default function ReadingView({ viewData, navigateTo, sizes, viewMode, onPrefetchVerseDetail }) {
  if (!viewData || !viewData.verses) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 slide-up">
      {viewMode === 'meal' && (
        <div className="text-center mb-8 bg-white dark:bg-slate-900/80 p-10 md:p-14 rounded-[2.5rem] shadow-sm relative overflow-hidden">
          <h2 className="text-6xl md:text-7xl font-arabic-amiri font-bold text-emerald-950 dark:text-emerald-400 mb-6 relative z-10">{viewData.name_original}</h2>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold mb-8 relative z-10">
            <span className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full text-emerald-700 dark:text-emerald-400">{viewData.name} Suresi</span>
            <span className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full">{viewData.verse_count} Ayet</span>
            <span className="bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-full">Sayfa {viewData.page_number}</span>
          </div>
          {viewData.audio && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-2 rounded-full flex items-center justify-center max-w-sm mx-auto relative z-10">
              <audio key={viewData.audio.mp3} controls className="w-full h-12 outline-none rounded-full dark:opacity-90">
                <source src={viewData.audio.mp3} type="audio/mpeg" />
              </audio>
            </div>
          )}
        </div>
      )}

      {viewMode === 'meal' && viewData.zero && (
        <div className="text-center mb-12 py-10 border-y border-emerald-100/50 dark:border-slate-800/80">
          <p className={`${FONT_SIZES.arabic[sizes.arabicSize]} ${sizes.arabicFontClass} text-slate-800 dark:text-slate-200 leading-loose mb-6 transition-all`} dir="rtl">{viewData.zero.verse}</p>
          <p className={`text-slate-500 dark:text-slate-400 italic ${FONT_SIZES.translation[sizes.transSize]} transition-all`}>{viewData.zero.translation?.text}</p>
        </div>
      )}

      {viewMode === 'mushaf' ? (
        <div className="mushaf-page mushaf-sheet p-8 md:p-16 rounded-[2.5rem] shadow-sm relative overflow-hidden">
          <div className="mushaf-frame absolute inset-3 md:inset-5 border-2 border-emerald-100/60 dark:border-slate-800/80 rounded-[1.5rem] pointer-events-none"></div>

          <div className="relative z-10">
            <div className="mushaf-surah-head text-center mb-10 pb-8 border-b-2 border-emerald-100/50 dark:border-slate-800/80">
              <div className="mushaf-title-wrap bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200/50 dark:border-slate-700 rounded-full py-4 px-12 inline-block shadow-sm">
                <h2 className="mushaf-title text-4xl md:text-5xl font-arabic-amiri font-bold text-emerald-950 dark:text-emerald-400">{viewData.name_original}</h2>
              </div>
            </div>

            {viewData.zero && (
              <div className="mushaf-basmalah text-center mb-10">
                <p className={`${FONT_SIZES.arabic[sizes.arabicSize]} ${sizes.arabicFontClass} text-slate-800 dark:text-slate-200 leading-loose`} dir="rtl">
                  {viewData.zero.verse}
                </p>
              </div>
            )}

            <p className={`mushaf-layout ${FONT_SIZES.arabic[sizes.arabicSize]} ${sizes.arabicFontClass} text-slate-900 dark:text-slate-100 transition-all`}>
              {viewData.verses?.map((verse) => (
                <Fragment key={verse.id}>
                  <span
                    className="mushaf-word hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 cursor-pointer rounded-md transition-colors"
                    onMouseEnter={onPrefetchVerseDetail}
                    onFocus={onPrefetchVerseDetail}
                    onClick={() => navigateTo({ type: 'verse_detail', surahId: viewData.id, verseNum: verse.verse_number })}
                    title={`${viewData.name} Suresi, ${verse.verse_number}. Ayet Detayı`}
                  >
                    {verse.verse}
                  </span>
                  <span className="ayah-marker mushaf-ayah-marker text-emerald-700 dark:text-emerald-500 font-arabic-amiri font-bold text-[0.9em]">
                    ﴾{toArabicNumber(verse.verse_number)}﴿
                  </span>
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      ) : (
        <div>
          {viewData.verses?.map((verse) => (
            <VerseCard key={verse.id} verse={verse} navigateTo={navigateTo} surahId={viewData.id} verseNum={verse.verse_number} sizes={sizes} onPrefetchVerseDetail={onPrefetchVerseDetail} />
          ))}
        </div>
      )}
    </div>
  );
}
