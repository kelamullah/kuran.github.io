import { useState, useEffect, memo, Fragment, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

        // İKONLAR (Material Outline)
        const createIcon = (paths) => ({ className, title, onClick }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : '') + paths }} />
        );
        const BookOpen = createIcon('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>');
        const Search = createIcon('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>');
        const ChevronRight = createIcon('<path d="m9 18 6-6-6-6"/>');
        const ChevronLeft = createIcon('<path d="m15 18-6-6 6-6"/>');
        const MenuIcon = createIcon('<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>');
        const AlertCircle = createIcon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>');
        const Loader2 = createIcon('<path d="M21 12a9 9 0 1 1-6.219-8.56"/>');
        const Globe = createIcon('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>');
        const FileText = createIcon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>');
        const Type = createIcon('<polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>');
        const Layers = createIcon('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>');
        const ArrowRight = createIcon('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>');
        const Copy = createIcon('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>');
        const Check = createIcon('<polyline points="20 6 9 17 4 12"/>');
        const Hash = createIcon('<line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>');
        const Info = createIcon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>');
        const Settings = createIcon('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>');
        const Moon = createIcon('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>');
        const Sun = createIcon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>');
        const AMinus = createIcon('<path d="M9 20V4l-7 16"/><path d="M4 14h8"/><line x1="16" y1="12" x2="22" y2="12"/>');
        const APlus = createIcon('<path d="M9 20V4l-7 16"/><path d="M4 14h8"/><line x1="19" y1="9" x2="19" y2="15"/><line x1="16" y1="12" x2="22" y2="12"/>');

        const API_BASE_URL = 'https://api.acikkuran.com';
        const DEFAULT_AUTHOR_ID = 105; 
        const ALLOWED_TR = ['diyanet', 'elmalılı', 'elmalili', 'ibni kesir', 'ibn kesir', 'ibn-i kesir', 'hasan basri'];
        const ALLOWED_EN = ['khattab', 'haleem', 'usmani', 'bewley', 'pickthall', 'yusuf ali', 'maududi'];

        const FONT_SIZES = {
            arabic: ['text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'],
            translation: ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl']
        };

        const ARABIC_FONTS = [
            { id: 'abay', name: 'Abay', className: 'font-arabic-abay' },
            { id: 'latif', name: 'Latif', className: 'font-arabic-latif' },
            { id: 'hamdullah', name: 'Hamdullah', className: 'font-arabic-hamdullah' },
            { id: 'amiri', name: 'Sistem (Amiri)', className: 'font-arabic-amiri' }
        ];

        const toArabicNumber = (num) => {
            const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            return num.toString().split('').map(digit => arabicNumbers[parseInt(digit)]).join('');
        };

        class ApiService {
            constructor() {
                this.cache = new Map();
                this.pending = new Map();
            }
            async fetch(endpoint) {
                if (this.cache.has(endpoint)) return this.cache.get(endpoint);
                if (this.pending.has(endpoint)) return this.pending.get(endpoint);

                const request = (async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}${endpoint}`);
                    if (!response.ok) throw new Error(`HTTP hatası! Durum: ${response.status}`);
                    const json = await response.json();
                    const result = (json.meta || json.links) ? json : (json.data !== undefined ? json.data : json);
                    this.cache.set(endpoint, result);
                    return result;
                } catch (error) { throw error; }
                finally {
                    this.pending.delete(endpoint);
                }
                })();

                this.pending.set(endpoint, request);
                return request;
            }
            getAuthors() { return this.fetch('/authors'); }
            getSurahs() { return this.fetch('/surahs'); }
            getSurah(surahId, authorId) { return this.fetch(`/surah/${surahId}?author=${authorId}`); }
            getVerse(surahId, verseNum, authorId) { return this.fetch(`/surah/${surahId}/verse/${verseNum}?author=${authorId}`); }
            getVerseTranslations(surahId, verseNum) { return this.fetch(`/surah/${surahId}/verse/${verseNum}/translations`); }
            getVerseWords(surahId, verseNum) { return this.fetch(`/surah/${surahId}/verse/${verseNum}/words`); }
            getVerseParts(surahId, verseNum) { return this.fetch(`/surah/${surahId}/verse/${verseNum}/verseparts`); }
            getRootchars() { return this.fetch('/rootchars'); }
            getRootsByChar(charId) { return this.fetch(`/rootchar/${charId}`); }
            getRootByLatin(latinChars) { return this.fetch(`/root/latin/${latinChars}`); }
            getRootVerseParts(latinChars, page, authorId) { return this.fetch(`/root/latin/${latinChars}/verseparts?page=${page}&author=${authorId}`); }
            getPage(pageNum, authorId) { return this.fetch(`/page/${pageNum}?author_id=${authorId}`); }
            search(query, authorId) { return this.fetch(`/search?q=${encodeURIComponent(query)}&author=${authorId}`); }
        }
        const api = new ApiService();

        // ==========================================
        // YARDIMCI BİLE�?ENLER
        // ==========================================
        
        // Material You Filled Card Tarzı VerseCard
        const VerseCard = memo(({ verse, onDetailClick, hideActions = false, sizes }) => {
            const [copied, setCopied] = useState(false);
            const { arabicSize, transSize, arabicFontClass } = sizes;

            const copyToClipboard = (text) => {
                const textArea = document.createElement("textarea");
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try { document.execCommand('copy'); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (err) {}
                document.body.removeChild(textArea);
            };

            const translationText = verse.translation?.text || (typeof verse.translation === 'string' ? verse.translation : 'Çeviri yüklenemedi.');
            const formattedTranslation = translationText.replace(/<mark>/g, '<mark class="bg-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-100 text-emerald-950 px-1.5 rounded-md">');

            return (
                <div className="bg-white dark:bg-slate-900/80 p-6 md:p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow mb-6 group border border-transparent dark:border-slate-800/50">
                <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col items-center space-y-3">
                    {verse.surah && (
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full mb-1 text-center">
                        {verse.surah.name}<br/>{verse.verse_number}
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
                        <p key={fn.id || idx}><strong className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded mr-1">[{fn.number}]</strong> {fn.text}</p>
                        ))}
                    </div>
                    )}
                </div>
                
                {!hideActions && (
                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex justify-end">
                    <button onClick={onDetailClick} className="text-sm font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 px-5 py-2.5 rounded-full transition-colors">
                        <FileText className="w-4 h-4" />
                        <span>Analiz & Diğer Çeviriler</span>
                    </button>
                    </div>
                )}
                </div>
            );
        });

        // ==========================================
        // GÖRÜNÜMLER
        // ==========================================
        const LoadingView = () => (
            <div className="flex flex-col items-center justify-center h-full space-y-4 py-20 fade-in">
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 animate-spin" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">İçerik Yükleniyor...</p>
            </div>
        );

        const ErrorView = ({ msg, onReturnHome }) => (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-6 rounded-[2rem] flex items-start space-x-4 m-8 border border-red-100 dark:border-red-900/30 max-w-2xl mx-auto fade-in">
                <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-full shrink-0">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div className="pt-1">
                <h3 className="font-bold mb-1 text-lg">Bir Hata Oluştu</h3><p className="opacity-90">{msg}</p>
                <button onClick={onReturnHome} className="mt-5 text-sm font-bold bg-white dark:bg-red-950 px-6 py-2.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900 shadow-sm transition-colors">Ana Sayfaya Dön</button>
                </div>
            </div>
        );

        const HomeView = ({ navigateTo, onOpenDictionary }) => (
            <div className="p-4 md:p-8 max-w-3xl mx-auto text-center space-y-8 slide-up">
                <div className="bg-white dark:bg-slate-900/80 p-10 md:p-16 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>
                <div className="bg-emerald-100 dark:bg-emerald-900/40 w-28 h-28 rounded-[2rem] flex items-center justify-center mx-auto mb-10 rotate-3 hover:rotate-0 transition-transform duration-500">
                    <BookOpen className="w-12 h-12 text-emerald-600 dark:text-emerald-400 relative z-10" />
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 relative z-10 tracking-tight">Kur’ân-ı Kerîm</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-md mx-auto leading-relaxed relative z-10">
                    Kelime tahlilleri, kök sözlüğü ve farklı meallerle Kur’ân-ı Kerîm'i daha derinlemesine inceleyin.
                </p>
                <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 relative z-10">
                    <button onClick={() => navigateTo({ type: 'surah', surahId: 1 })} className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 dark:shadow-none text-lg">Okumaya Başla</button>
                    <button onClick={onOpenDictionary} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-lg">Kök Sözlüğü</button>
                </div>
                </div>
            </div>
        );

        const ReadingView = ({ viewData, navigateTo, sizes, viewMode }) => {
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
                    <div className="mushaf-page p-6 md:p-14 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                        <div className="absolute inset-3 md:inset-5 border-2 border-emerald-100/60 dark:border-slate-800/80 rounded-[1.5rem] pointer-events-none"></div>
                        
                        <div className="relative z-10">
                            <div className="text-center mb-10 pb-8 border-b-2 border-emerald-100/50 dark:border-slate-800/80">
                                <div className="bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200/50 dark:border-slate-700 rounded-full py-4 px-12 inline-block shadow-sm">
                                    <h2 className="text-4xl md:text-5xl font-arabic-amiri font-bold text-emerald-950 dark:text-emerald-400">{viewData.name_original}</h2>
                                </div>
                            </div>
                            
                            {viewData.zero && (
                                <div className="text-center mb-10">
                                    <p className={`${FONT_SIZES.arabic[sizes.arabicSize]} ${sizes.arabicFontClass} text-slate-800 dark:text-slate-200 leading-loose`} dir="rtl">
                                        {viewData.zero.verse}
                                    </p>
                                </div>
                            )}
                            
                            <p className={`mushaf-layout ${FONT_SIZES.arabic[sizes.arabicSize]} ${sizes.arabicFontClass} text-slate-900 dark:text-slate-100 transition-all`}>
                                {viewData.verses?.map((verse) => (
                                    <Fragment key={verse.id}>
                                        <span 
                                            className="hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 cursor-pointer rounded-md transition-colors"
                                            onClick={() => navigateTo({ type: 'verse_detail', surahId: viewData.id, verseNum: verse.verse_number })}
                                            title={`${viewData.name} Suresi, ${verse.verse_number}. Ayet Detayı`}
                                        >
                                            {verse.verse}
                                        </span>
                                        <span className="ayah-marker text-emerald-700 dark:text-emerald-500 font-arabic-amiri font-bold text-[0.9em]">
                                            ﴾{toArabicNumber(verse.verse_number)}﴿
                                        </span>
                                    </Fragment>
                                ))}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        {viewData.verses?.map(verse => <VerseCard key={verse.id} verse={verse} onDetailClick={() => navigateTo({ type: 'verse_detail', surahId: viewData.id, verseNum: verse.verse_number })} sizes={sizes} />)}
                    </div>
                )}
                </div>
            );
        };

        const PageReadingView = ({ viewData, viewState, navigateTo, sizes, viewMode }) => {
            const verses = Array.isArray(viewData) ? viewData : (viewData?.verses || null);
            if (!verses) return null; 
            if (verses.length === 0) return <ErrorView msg="Bu sayfa için veri bulunamadı." onReturnHome={() => navigateTo({type: 'home'})} />;
            
            let currentSurahTracker = null;
            
            const groupedVerses = [];
            verses.forEach(verse => {
                const surahId = verse.surah?.id;
                if (!groupedVerses.length || groupedVerses[groupedVerses.length - 1].surahId !== surahId) {
                    groupedVerses.push({ surahId, surah: verse.surah, zero: verse.verse_number === 1 ? verse.zero : null, verses: [] });
                }
                groupedVerses[groupedVerses.length - 1].verses.push(verse);
            });

            return (
                <div className="max-w-4xl mx-auto p-4 md:p-8 slide-up">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl sticky top-0 z-10 pt-4 rounded-b-[2rem] px-4">
                    <h2 className="text-2xl font-extrabold flex items-center text-slate-800 dark:text-slate-100">
                    <div className="bg-emerald-100 dark:bg-emerald-900/40 p-2 rounded-full mr-3 text-emerald-700 dark:text-emerald-400">
                        <Hash className="w-5 h-5"/>
                    </div>
                    Sayfa {viewState.pageNum}
                    </h2>
                    <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 rounded-full p-1 shadow-sm">
                    <button onClick={() => navigateTo({ type: 'page', pageNum: viewState.pageNum - 1 })} disabled={viewState.pageNum <= 1} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors" aria-label="Önceki sayfaya git"><ChevronLeft className="w-5 h-5"/></button>
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
                    <button onClick={() => navigateTo({ type: 'page', pageNum: viewState.pageNum + 1 })} disabled={viewState.pageNum >= 604} className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors" aria-label="Sonraki sayfaya git"><ChevronRight className="w-5 h-5"/></button>
                    </div>
                </div>

                {viewMode === 'mushaf' ? (
                    <div className="mushaf-page p-6 md:p-14 rounded-[2.5rem] shadow-sm relative overflow-hidden">
                        <div className="absolute inset-3 md:inset-5 border-2 border-emerald-100/60 dark:border-slate-800/80 rounded-[1.5rem] pointer-events-none"></div>
                        
                        <div className="relative z-10 space-y-12">
                            {groupedVerses.map((group, gIdx) => (
                                <div key={group.surahId || gIdx}>
                                    {group.surah && (
                                        <div className="text-center mb-8 pb-8 border-b-2 border-emerald-100/50 dark:border-slate-800/80 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigateTo({ type: 'surah', surahId: group.surah.id })}>
                                            <div className="bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200/50 dark:border-slate-700 rounded-full py-4 px-12 inline-block shadow-sm">
                                                <h2 className="text-4xl md:text-5xl font-arabic-amiri font-bold text-emerald-950 dark:text-emerald-400">{group.surah.name_original}</h2>
                                            </div>
                                        </div>
                                    )}
                                    {group.zero && (
                                        <div className="text-center mb-10">
                                            <p className={`${FONT_SIZES.arabic[sizes.arabicSize]} ${sizes.arabicFontClass} text-slate-800 dark:text-slate-200 leading-loose`} dir="rtl">{group.zero.verse}</p>
                                        </div>
                                    )}
                                    <p className={`mushaf-layout ${FONT_SIZES.arabic[sizes.arabicSize]} ${sizes.arabicFontClass} text-slate-900 dark:text-slate-100 transition-all`}>
                                        {group.verses.map(verse => (
                                            <Fragment key={verse.id}>
                                                <span 
                                                    className="hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 cursor-pointer rounded-md transition-colors"
                                                    onClick={() => navigateTo({ type: 'verse_detail', surahId: group.surah?.id || verse.surah?.id, verseNum: verse.verse_number })}
                                                >
                                                    {verse.verse}
                                                </span>
                                                <span className="ayah-marker text-emerald-700 dark:text-emerald-500 font-arabic-amiri font-bold text-[0.9em]">
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
                        {verses.map(verse => {
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
                            <VerseCard verse={verse} onDetailClick={() => navigateTo({ type: 'verse_detail', surahId: verse.surah?.id, verseNum: verse.verse_number })} sizes={sizes} />
                            </Fragment>
                        );
                        })}
                    </div>
                )}
                </div>
            );
        };

        const VerseDetailView = ({ viewData, viewState, navigateTo, sizes }) => {
            const [activeTab, setActiveTab] = useState('translations');
            if (!viewData || !viewData.fullVerse) return null;

            return (
                <div className="max-w-4xl mx-auto p-4 md:p-8 slide-up">
                <button onClick={() => navigateTo({ type: 'surah', surahId: viewState.surahId })} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 mb-8 font-bold transition-all bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-sm">
                    <ChevronLeft className="w-5 h-5" /> <span>Sureye Dön</span>
                </button>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm p-10 md:p-12 mb-8 text-center relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-widest rounded-full cursor-pointer hover:bg-emerald-200 dark:hover:bg-emerald-800/80 transition-colors shadow-sm" onClick={() => navigateTo({ type: 'surah', surahId: viewData.fullVerse?.surah?.id || viewState.surahId })}>
                    {viewData.fullVerse?.surah?.name ? `${viewData.fullVerse.surah.name}, ` : `${viewState.surahId}. Sure, `}{viewData.fullVerse?.verse_number || viewState.verseNum}. Ayet
                    </div>
                    <p className={`${FONT_SIZES.arabic[sizes.arabicSize]} ${sizes.arabicFontClass} leading-loose text-slate-900 dark:text-white mt-6 transition-all`} dir="rtl">{viewData.fullVerse?.verse}</p>
                </div>

                <div className="flex bg-slate-200/50 dark:bg-slate-800/50 p-1.5 rounded-full mb-8">
                    {[
                    { id: 'translations', label: 'Tüm Çeviriler', icon: <Globe className="w-5 h-5"/> },
                    { id: 'words', label: 'Kelime Kelime', icon: <Type className="w-5 h-5"/> },
                    { id: 'grammar', label: 'Gramer', icon: <Layers className="w-5 h-5"/> }
                    ].map(tab => (
                    <button 
                        key={tab.id}
                        className={`flex-1 flex items-center justify-center space-x-2 py-3.5 px-4 text-sm font-bold rounded-full transition-all ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'}`} 
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                    ))}
                </div>

                <div className="space-y-6">
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
                        )) || <div className="text-center w-full py-20 text-slate-400 font-medium">Bu veri henüz eklenmemiş.</div>}
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
                                {viewData.verseparts?.map((vp, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className={`${FONT_SIZES.arabic[sizes.arabicSize - 1 < 0 ? 0 : sizes.arabicSize - 1]} ${sizes.arabicFontClass} p-6 text-slate-900 dark:text-white transition-all`} dir="rtl">{vp.arabic}</td>
                                    <td className="p-6 text-base font-bold text-emerald-700 dark:text-emerald-400">{vp.translation_tr}</td>
                                    <td className="p-6">
                                    {vp.details?.map((group, gIdx) => (
                                        <div key={gIdx} className="flex flex-wrap gap-2 mb-1.5">
                                        {group.map((d, dIdx) => (
                                            <span key={dIdx} className="bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full">{d.tr}</span>
                                        ))}
                                        </div>
                                    ))}
                                    </td>
                                </tr>
                                ))}
                                {(!viewData.verseparts || viewData.verseparts.length === 0) && (
                                <tr><td colSpan="3" className="p-12 text-center text-slate-400 dark:text-slate-500 font-medium">Bu ayet için gramer verisi bulunmuyor.</td></tr>
                                )}
                            </tbody>
                            </table>
                        </div>
                    </div>
                    )}
                </div>
                </div>
            );
        };

        const RootDetailView = ({ viewData, viewState, navigateTo, sizes }) => {
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
                        {detail.diffs?.map(diff => (
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
                    <Layers className="w-7 h-7 mr-3 text-emerald-600 dark:text-emerald-500"/> 
                    Kur'an'daki Örnekler
                    </h3>
                    
                    <div className="grid gap-6">
                    {viewData.verses?.map(item => (
                        <div key={item.id} className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-transparent dark:border-slate-800/50 relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-8">
                            <div className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full cursor-pointer hover:bg-emerald-100 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors" onClick={() => navigateTo({ type: 'surah', surahId: item.surah.id })}>
                            {item.surah.name} : {item.verse.verse_number}
                            </div>
                            <button onClick={() => navigateTo({ type: 'verse_detail', surahId: item.surah.id, verseNum: item.verse.verse_number })} className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 p-3 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors" aria-label={`${item.surah.name} ${item.verse.verse_number}. ayet detayını aç`}>
                            <ArrowRight className="w-5 h-5"/>
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
        };

        const SearchView = ({ viewData, viewState, navigateTo, sizes }) => {
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
                    {verses.map(verse => (
                        <VerseCard key={verse.id} verse={verse} onDetailClick={() => navigateTo({ type: 'verse_detail', surahId: verse.surah?.id, verseNum: verse.verse_number })} sizes={sizes}/>
                    ))}
                    </div>
                )}
                </div>
            );
        };

        // Material You Tasarımlı Yan Menü (Navigation Rail / Drawer)
        const Sidebar = ({ sidebarOpen, navTab, setNavTab, surahs, viewState, navigateTo, rootChars, charRoots, setCharRoots, loadRootsForChar, sizes }) => {
            const pageNumbers = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);
            return (
            <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-80 bg-slate-100 dark:bg-slate-900 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                
                {/* Segmented Navigation (Pill-shaped) */}
                <div className="mt-20 lg:mt-6 mx-4 mb-4">
                    <div className="flex bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-full">
                    {['surahs', 'pages', 'dictionary'].map(tab => (
                        <button 
                        key={tab}
                        className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${navTab === tab ? 'bg-white dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'}`} 
                        onClick={() => setNavTab(tab)}
                        >
                        {tab === 'surahs' ? 'Sure' : tab === 'pages' ? 'Sayfa' : 'Sözlük'}
                        </button>
                    ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
                {navTab === 'surahs' && (
                    <div className="space-y-1 mt-2">
                    {surahs?.map((surah) => {
                        const isActive = viewState.type === 'surah' && viewState.surahId === surah.id;
                        return (
                        <button key={surah.id} onClick={() => navigateTo({ type: 'surah', surahId: surah.id }, true)} className={`w-full text-left px-5 py-3.5 rounded-full flex items-center justify-between transition-all ${isActive ? 'bg-emerald-200 dark:bg-emerald-800 text-emerald-950 dark:text-emerald-100 font-bold' : 'hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                            <div className="flex items-center space-x-4">
                            <span className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${isActive ? 'bg-emerald-800/10 dark:bg-emerald-950/50' : 'bg-slate-200 dark:bg-slate-800'}`}>{surah.id}</span>
                            <div>
                                <div className="text-sm">{surah.name}</div>
                                <div className={`text-xs opacity-70 ${isActive ? 'font-medium' : ''}`}>{surah.verse_count} Ayet</div>
                            </div>
                            </div>
                            <div className={`text-xl font-arabic-amiri ${isActive ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-400 dark:text-slate-500'}`}>{surah.name_original}</div>
                        </button>
                        )
                    })}
                    </div>
                )}

                {navTab === 'pages' && (
                    <div className="p-2">
                    <div className="mb-6 flex space-x-2 bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-full">
                        <input type="number" id="pageJump" min="1" max="604" placeholder="Sayfa (1-604)" className="flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none font-bold placeholder-slate-400" onKeyDown={(e) => { if(e.key === 'Enter' && e.target.value) navigateTo({ type: 'page', pageNum: parseInt(e.target.value) }, true) }} />
                        <button onClick={() => { const val = document.getElementById('pageJump').value; if(val) navigateTo({ type: 'page', pageNum: parseInt(val) }, true); }} className="bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm transition-colors hover:text-emerald-800 dark:hover:text-emerald-200">Git</button>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {pageNumbers.map(p => {
                        const isActive = viewState.type === 'page' && viewState.pageNum === p;
                        return (
                            <button key={p} onClick={()=>navigateTo({ type: 'page', pageNum: p }, true)} className={`p-3 text-sm rounded-full transition-all ${isActive ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium'}`}>
                            {p}
                            </button>
                        )
                        })}
                    </div>
                    </div>
                )}

                {navTab === 'dictionary' && (
                    <div className="p-2 mt-2">
                    {charRoots ? (
                        <div className="slide-up">
                        <button onClick={() => setCharRoots(null)} className="mb-6 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center bg-slate-200 dark:bg-slate-800 px-5 py-3 rounded-full w-full justify-center transition-colors">
                            <ChevronLeft className="w-5 h-5 mr-1"/> Harflere Dön
                        </button>
                        <div className="space-y-2">
                            {charRoots.roots?.map(root => (
                            <button key={root.id} onClick={()=>navigateTo({ type: 'root_detail', latin: root.latin, page: 1 }, true)} className="w-full text-left px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-full flex justify-between items-center transition-all hover:bg-slate-200 dark:hover:bg-slate-700 group">
                                <span className="font-bold text-slate-700 dark:text-slate-200 text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{root.latin}</span>
                                <span className={`${sizes.arabicFontClass} text-2xl text-slate-800 dark:text-slate-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400`}>{root.arabic}</span>
                            </button>
                            ))}
                        </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-2" dir="rtl">
                        {rootChars?.map(char => (
                            <button key={char.id} onClick={()=>loadRootsForChar(char.id)} className={`p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400 ${sizes.arabicFontClass} text-3xl text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center`}>
                            {char.arabic}
                            </button>
                        ))}
                        </div>
                    )}
                    </div>
                )}
                </div>
            </aside>
            );
        };

        // ==========================================
        // ANA UYGULAMA (APP) BİLE�?ENİ
        // ==========================================
        function App() {
            const [authors, setAuthors] = useState([]);
            const [surahs, setSurahs] = useState([]);
            const [rootChars, setRootChars] = useState([]);
            const [selectedAuthor, setSelectedAuthor] = useState(DEFAULT_AUTHOR_ID);
            
            const [sidebarOpen, setSidebarOpen] = useState(false);
            const [navTab, setNavTab] = useState('surahs'); 
            const [charRoots, setCharRoots] = useState(null);
            const [searchQuery, setSearchQuery] = useState('');
            const [showSettings, setShowSettings] = useState(false);
            const settingsRef = useRef(null);
            
            // --- AYARLAR (State) ---
            const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));
            const [arabicSize, setArabicSize] = useState(() => parseInt(localStorage.getItem('arabicSize')) || 1); 
            const [transSize, setTransSize] = useState(() => parseInt(localStorage.getItem('transSize')) || 2);
            // Varsayılan Hamdullah
            const [arabicFontId, setArabicFontId] = useState(() => localStorage.getItem('arabicFontId') || 'hamdullah'); 
            const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') || 'meal');
            
            const activeArabicFontClass = ARABIC_FONTS.find(f => f.id === arabicFontId)?.className || 'font-arabic-hamdullah';
            const currentSizes = { arabicSize, transSize, arabicFontClass: activeArabicFontClass };

            useEffect(() => {
                if (darkMode) { document.documentElement.classList.add('dark'); localStorage.setItem('theme', 'dark'); } 
                else { document.documentElement.classList.remove('dark'); localStorage.setItem('theme', 'light'); }
            }, [darkMode]);
            useEffect(() => { localStorage.setItem('arabicSize', arabicSize); }, [arabicSize]);
            useEffect(() => { localStorage.setItem('transSize', transSize); }, [transSize]);
            useEffect(() => { localStorage.setItem('arabicFontId', arabicFontId); }, [arabicFontId]);
            useEffect(() => { localStorage.setItem('viewMode', viewMode); }, [viewMode]);

            useEffect(() => {
                const handleClickOutside = (event) => {
                    if (settingsRef.current && !settingsRef.current.contains(event.target)) setShowSettings(false);
                };
                document.addEventListener("mousedown", handleClickOutside);
                return () => document.removeEventListener("mousedown", handleClickOutside);
            }, [settingsRef]);

            const getInitialState = () => {
                try {
                    const params = new URLSearchParams(window.location.search);
                    const stateParam = params.get('state');
                    if(stateParam) return JSON.parse(decodeURIComponent(stateParam));

                    const lastRead = localStorage.getItem('lastReadState');
                    if(lastRead) return JSON.parse(lastRead);
                } catch(e) {}
                return { type: 'home' };
            };

            const [viewState, setViewState] = useState(getInitialState());
            const [viewData, setViewData] = useState(null);
            const [loading, setLoading] = useState(false);
            const [error, setError] = useState(null);

            useEffect(() => {
                const handlePopState = (event) => setViewState(event.state ? event.state : { type: 'home' });
                window.addEventListener('popstate', handlePopState);
                return () => window.removeEventListener('popstate', handlePopState);
            }, []);

            useEffect(() => {
                const loadInitialData = async () => {
                try {
                    const [rawAuthorsData, surahsData, rootCharsData] = await Promise.all([api.getAuthors(), api.getSurahs(), api.getRootchars()]);
                    const filteredAuthors = (rawAuthorsData || []).filter(author => {
                        const name = author.name.toLocaleLowerCase('tr-TR');
                        const lang = author.language?.toLowerCase() || 'tr';
                        return lang === 'tr' ? ALLOWED_TR.some(k => name.includes(k)) : ALLOWED_EN.some(k => name.includes(k));
                    });
                    setAuthors(filteredAuthors); setSurahs(surahsData || []); setRootChars(rootCharsData || []);
                    
                    // Varsayılan yazar: Hasan Basri
                    const hasanBasri = filteredAuthors.find(a => a.name.toLocaleLowerCase('tr-TR').includes('hasan basri'));
                    if (hasanBasri) setSelectedAuthor(parseInt(hasanBasri.id));
                    else if (filteredAuthors.length > 0) setSelectedAuthor(parseInt(filteredAuthors[0].id));
                } catch (err) { console.error("İlk yükleme hatası:", err); }
                };
                loadInitialData();
            }, []);

            useEffect(() => {
                let isMounted = true;
                const fetchViewData = async () => {
                if (viewState.type === 'home') return;
                setLoading(true); setError(null);
                try {
                    let data = null;
                    switch (viewState.type) {
                    case 'surah': data = await api.getSurah(viewState.surahId, selectedAuthor); break;
                    case 'page': const pageResp = await api.getPage(viewState.pageNum, selectedAuthor); data = Array.isArray(pageResp) ? pageResp : Object.values(pageResp); data.sort((a,b) => a.id - b.id); break;
                    case 'verse_detail':
                        const [fullVerse, words, translationsData, verseparts] = await Promise.all([api.getVerse(viewState.surahId, viewState.verseNum, selectedAuthor), api.getVerseWords(viewState.surahId, viewState.verseNum), api.getVerseTranslations(viewState.surahId, viewState.verseNum), api.getVerseParts(viewState.surahId, viewState.verseNum)]);
                        const filteredTranslations = (translationsData || []).filter(t => { const name = (t.author?.name || t.author || '').toLocaleLowerCase('tr-TR'); return ALLOWED_TR.some(k => name.includes(k)) || ALLOWED_EN.some(k => name.includes(k)); });
                        data = { fullVerse, words, translations: filteredTranslations, verseparts }; break;
                    case 'root_detail':
                        const detail = await api.getRootByLatin(viewState.latin);
                        const versesResp = await api.getRootVerseParts(viewState.latin, viewState.page || 1, selectedAuthor);
                        data = { detail, verses: versesResp.data, meta: versesResp.meta }; break;
                    case 'search': data = await api.search(viewState.query, selectedAuthor); break;
                    }
                    if (isMounted) setViewData(data);
                } catch (err) { if (isMounted) setError('Veri yüklenirken bir hata oluştu.'); } 
                finally { if (isMounted) setLoading(false); }
                };
                fetchViewData();
                return () => { isMounted = false; };
            }, [viewState, selectedAuthor]);

            const navigateTo = (newState, pushHistory = true) => {
                setSidebarOpen(false);
                setViewData(null); 
                if(pushHistory) {
                    const urlParams = new URLSearchParams();
                    urlParams.set('state', encodeURIComponent(JSON.stringify(newState)));
                    try { window.history.pushState(newState, '', '?' + urlParams.toString()); } catch (err) {}
                }
                setViewState(newState);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if(newState.type !== 'home' && newState.type !== 'search') { localStorage.setItem('lastReadState', JSON.stringify(newState)); }
            };

            const handleSearchSubmit = (e) => { e.preventDefault(); if (searchQuery.trim().length > 2) { document.activeElement.blur(); navigateTo({ type: 'search', query: searchQuery.trim() }); } };
            const loadRootsForChar = async (charId) => { try { const roots = await api.getRootsByChar(charId); setCharRoots({ charId, roots }); } catch(err) {} };

            return (
                <div className="flex h-screen w-full relative bg-slate-50 dark:bg-slate-950 transition-colors">
                    {/* Drawer Overlay */}
                    {sidebarOpen && <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity" onClick={() => setSidebarOpen(false)} />}

                    <Sidebar sidebarOpen={sidebarOpen} navTab={navTab} setNavTab={setNavTab} surahs={surahs} viewState={viewState} navigateTo={navigateTo} rootChars={rootChars} charRoots={charRoots} setCharRoots={setCharRoots} loadRootsForChar={loadRootsForChar} sizes={currentSizes} />

                    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                        {/* Top App Bar (Material 3 Style) */}
                        <header className="bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-2xl sticky top-0 z-20 px-4 py-4 md:px-8 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-3 bg-white dark:bg-slate-800 rounded-full text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm" aria-label={sidebarOpen ? 'Menüyü kapat' : 'Menüyü aç'}>
                                <MenuIcon className="w-6 h-6" />
                            </button>
                            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigateTo({ type: 'home' })}>
                            <div className="w-12 h-12 bg-emerald-600 dark:bg-emerald-700 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="font-extrabold text-xl hidden sm:block tracking-tight text-slate-800 dark:text-slate-100">Kuran<span className="text-emerald-600 dark:text-emerald-400 font-light">App</span></h1>
                            </div>
                        </div>
                        
                        <div className="flex items-center flex-1 max-w-xl mx-6 hidden md:block">
                            <form onSubmit={handleSearchSubmit} className="relative w-full group">
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Kur'an'da ara..." className="w-full bg-slate-200/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-base rounded-full pl-14 pr-6 py-4 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder-slate-500 dark:placeholder-slate-400" aria-label="Kur'an içinde ara" />
                            <button type="submit" className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400 transition-colors" aria-label="Aramayı başlat">
                                <Search className="w-5 h-5" />
                            </button>
                            </form>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <div className="relative hidden sm:block">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 dark:text-slate-400 pointer-events-none" />
                                <select value={selectedAuthor} onChange={(e) => setSelectedAuthor(parseInt(e.target.value))} className="bg-slate-200/70 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 text-sm font-bold rounded-full pl-11 pr-10 py-3.5 outline-none hover:bg-slate-300/70 dark:hover:bg-slate-700 transition-colors appearance-none cursor-pointer" aria-label="Meal yazarı seçimi">
                                    {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                </select>
                            </div>

                            {/* Ayarlar FAB/Butonu */}
                            <div className="relative" ref={settingsRef}>
                                <button onClick={() => setShowSettings(!showSettings)} className="p-3.5 bg-slate-200/70 dark:bg-slate-800/80 hover:bg-emerald-100 dark:hover:bg-slate-700 rounded-full text-slate-700 dark:text-slate-300 transition-colors" aria-label={showSettings ? 'Ayarları kapat' : 'Ayarları aç'}>
                                    <Settings className="w-6 h-6" />
                                </button>
                                
                                {showSettings && (
                                    <div className="absolute right-0 mt-4 w-80 bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700 p-6 z-50 fade-in">
                                        <div className="mb-6 pb-6 border-b border-slate-100 dark:border-slate-700/50">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-extrabold text-slate-800 dark:text-slate-100">Ayarlar</span>
                                                <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors" aria-label={darkMode ? 'Açık moda geç' : 'Koyu moda geç'}>
                                                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            {/* GÖRÜNÜM SEÇİMİ */}
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block pl-2">Görünüm</span>
                                                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-full p-1.5">
                                                    <button onClick={() => setViewMode('meal')} className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${viewMode === 'meal' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>Meal</button>
                                                    <button onClick={() => setViewMode('mushaf')} className={`flex-1 py-2.5 text-sm font-bold rounded-full transition-all ${viewMode === 'mushaf' ? 'bg-white dark:bg-slate-700 shadow-sm text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}>Mushaf</button>
                                                </div>
                                            </div>

                                            {/* Font Seçimi */}
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block pl-2">Arapça Fontu</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {ARABIC_FONTS.map(font => (
                                                        <button 
                                                            key={font.id} 
                                                            onClick={() => setArabicFontId(font.id)}
                                                            className={`py-3 px-4 text-sm rounded-[1.5rem] transition-colors ${arabicFontId === font.id ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-bold' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                                        >
                                                            {font.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Font Boyutları */}
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block pl-2">Arapça Boyutu</span>
                                                <div className="flex bg-slate-100 dark:bg-slate-900 rounded-full p-1.5">
                                                    <button onClick={() => setArabicSize(Math.max(0, arabicSize - 1))} className="flex-1 py-2 flex justify-center hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-sm text-slate-700 dark:text-slate-300 transition-colors" aria-label="Arapça yazı boyutunu küçült"><AMinus className="w-5 h-5"/></button>
                                                    <button onClick={() => setArabicSize(Math.min(FONT_SIZES.arabic.length - 1, arabicSize + 1))} className="flex-1 py-2 flex justify-center hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-sm text-slate-700 dark:text-slate-300 transition-colors" aria-label="Arapça yazı boyutunu büyüt"><APlus className="w-5 h-5"/></button>
                                                </div>
                                            </div>
                                            
                                            {viewMode === 'meal' && (
                                                <div>
                                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block pl-2">Meal Boyutu</span>
                                                    <div className="flex bg-slate-100 dark:bg-slate-900 rounded-full p-1.5">
                                                        <button onClick={() => setTransSize(Math.max(0, transSize - 1))} className="flex-1 py-2 flex justify-center hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-sm text-slate-700 dark:text-slate-300 transition-colors" aria-label="Meal yazı boyutunu küçült"><AMinus className="w-5 h-5"/></button>
                                                        <button onClick={() => setTransSize(Math.min(FONT_SIZES.translation.length - 1, transSize + 1))} className="flex-1 py-2 flex justify-center hover:bg-white dark:hover:bg-slate-700 rounded-full shadow-sm text-slate-700 dark:text-slate-300 transition-colors" aria-label="Meal yazı boyutunu büyüt"><APlus className="w-5 h-5"/></button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        </header>

                        {/* Mobil Arama */}
                        <div className="md:hidden px-4 pb-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-2xl z-10">
                            <form onSubmit={handleSearchSubmit} className="relative w-full group">
                            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Kur'an'da kelime ara..." className="w-full bg-slate-200/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-base rounded-full pl-12 pr-6 py-3.5 outline-none focus:bg-white dark:focus:bg-slate-800 transition-all placeholder-slate-500" aria-label="Kur'an içinde ara" />
                            <button type="submit" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 dark:group-focus-within:text-emerald-400" aria-label="Aramayı başlat">
                                <Search className="w-5 h-5" />
                            </button>
                            </form>
                        </div>

                        <main className="flex-1 overflow-y-auto custom-scrollbar relative">
                        {loading ? <LoadingView /> : error ? <ErrorView msg={error} onReturnHome={() => navigateTo({type: 'home'})} /> : (
                            <div className="pb-24">
                            {viewState.type === 'home' && <HomeView navigateTo={navigateTo} onOpenDictionary={() => { setSidebarOpen(true); setNavTab('dictionary'); }} />}
                            {viewState.type === 'surah' && <ReadingView viewData={viewData} navigateTo={navigateTo} sizes={currentSizes} viewMode={viewMode} />}
                            {viewState.type === 'page' && <PageReadingView viewData={viewData} viewState={viewState} navigateTo={navigateTo} sizes={currentSizes} viewMode={viewMode} />}
                            {viewState.type === 'verse_detail' && <VerseDetailView viewData={viewData} viewState={viewState} navigateTo={navigateTo} sizes={currentSizes} />}
                            {viewState.type === 'root_detail' && <RootDetailView viewData={viewData} viewState={viewState} navigateTo={navigateTo} sizes={currentSizes} />}
                            {viewState.type === 'search' && <SearchView viewData={viewData} viewState={viewState} navigateTo={navigateTo} sizes={currentSizes} />}
                            </div>
                        )}
                        </main>
                    </div>
                </div>
            );
        }

        const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);
