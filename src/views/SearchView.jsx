import { memo, useCallback, useMemo, useState } from 'react';

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

const Info = createIcon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>');
const Copy = createIcon('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>');
const Check = createIcon('<polyline points="20 6 9 17 4 12"/>');
const FileText = createIcon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>');

const FONT_SIZES = {
  arabic: ['text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'],
  translation: ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl']
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
  const formattedTranslation = useMemo(() => (
    translationText.replace(/<mark>/g, '<mark class="bg-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-100 text-emerald-950 px-1.5 rounded-md">')
  ), [translationText]);

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

        {verse.translation?.footnotes?.length > 0 && (
          <div className="mt-5 pt-5 border-t border-dashed border-slate-200 dark:border-slate-800 text-sm text-slate-500 dark:text-slate-400 space-y-2">
            {verse.translation.footnotes.map((fn, idx) => (
              <p key={fn.id || idx}>
                <strong className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded mr-1">[{fn.number}]</strong> {fn.text}
              </p>
            ))}
          </div>
        )}
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

export default function SearchView({ viewData, viewState, navigateTo, sizes, onPrefetchVerseDetail }) {
  const verses = Array.isArray(viewData) ? viewData : (viewData?.verses || null);
  if (!verses) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 slide-up">
      <div className="mb-8 flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Arama Sonuçları</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">"{viewState.query}" için {verses.length || 0} sonuç bulundu.</p>
        </div>
      </div>

      {verses.length === 0 ? (
        <div className="text-center bg-white dark:bg-slate-900 p-16 rounded-[2.5rem]">
          <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Info className="w-10 h-10 text-slate-400 dark:text-slate-500" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-medium text-lg">Aradığınız kelimeye uygun bir sonuç bulunamadı.</p>
        </div>
      ) : (
        <div>
          {verses.map((verse) => (
            <VerseCard
              key={verse.id}
              verse={verse}
              navigateTo={navigateTo}
              surahId={verse.surah?.id}
              verseNum={verse.verse_number}
              sizes={sizes}
              onPrefetchVerseDetail={onPrefetchVerseDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
}
