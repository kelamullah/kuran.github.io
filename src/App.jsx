import { useState, useEffect, memo, useRef, useMemo, useCallback, lazy, Suspense } from 'react';
import { api, DEFAULT_AUTHOR_ID, ALLOWED_TR, ALLOWED_EN } from './services/apiService';

        // İKONLAR (Material Outline)
        const createIcon = (paths) => ({ className, title, onClick }) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} onClick={onClick} dangerouslySetInnerHTML={{ __html: (title ? `<title>${title}</title>` : '') + paths }} />
        );
        const BookOpen = createIcon('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>');
        const Search = createIcon('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>');
        const MenuIcon = createIcon('<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>');
        const AlertCircle = createIcon('<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>');
        const Loader2 = createIcon('<path d="M21 12a9 9 0 1 1-6.219-8.56"/>');
        const Globe = createIcon('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>');
        const FileText = createIcon('<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>');
        const Copy = createIcon('<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>');
        const Check = createIcon('<polyline points="20 6 9 17 4 12"/>');
        const Settings = createIcon('<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>');
        const Moon = createIcon('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>');
        const Sun = createIcon('<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>');
        const AMinus = createIcon('<path d="M9 20V4l-7 16"/><path d="M4 14h8"/><line x1="16" y1="12" x2="22" y2="12"/>');
        const APlus = createIcon('<path d="M9 20V4l-7 16"/><path d="M4 14h8"/><line x1="19" y1="9" x2="19" y2="15"/><line x1="16" y1="12" x2="22" y2="12"/>');

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
        const _legacyToArabicNumber = toArabicNumber;

        const LazyReadingView = lazy(() => import('./views/ReadingView.jsx'));
        const LazyPageReadingView = lazy(() => import('./views/PageReadingView.jsx'));
        const LazySidebar = lazy(() => import('./views/Sidebar.jsx'));
        const LazySearchView = lazy(() => import('./views/SearchView.jsx'));
        const LazyVerseDetailView = lazy(() => import('./views/VerseDetailView.jsx'));
        const LazyRootDetailView = lazy(() => import('./views/RootDetailView.jsx'));
        const ENABLE_INTERACTION_PREFETCH = true;

        // ==========================================
        // YARDIMCI BİLEŞENLER
        // ==========================================
        
        // Material You Filled Card Tarzı VerseCard
        const VerseCard = memo(({ verse, navigateTo, surahId, verseNum, hideActions = false, sizes }) => {
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
                    <button onClick={handleDetailClick} className="text-sm font-bold text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 px-5 py-2.5 rounded-full transition-colors">
                        <FileText className="w-4 h-4" />
                        <span>Analiz & Diğer Çeviriler</span>
                    </button>
                    </div>
                )}
                </div>
            );
        });
        const _legacyVerseCard = VerseCard;

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

        const HomeView = ({ navigateTo, onOpenDictionary, onPrefetchSurah, onPrefetchDictionary }) => (
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
                    <button onMouseEnter={onPrefetchSurah} onFocus={onPrefetchSurah} onClick={() => navigateTo({ type: 'surah', surahId: 1 })} className="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 dark:shadow-none text-lg">Okumaya Başla</button>
                    <button onMouseEnter={onPrefetchDictionary} onFocus={onPrefetchDictionary} onClick={onOpenDictionary} className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-lg">Kök Sözlüğü</button>
                </div>
                </div>
            </div>
        );

        // ==========================================
        // ANA UYGULAMA (APP) BİLEŞENİ
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
            const prefetchedChunksRef = useRef(new Set());
            
            // --- AYARLAR (State) ---
            const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches));
            const [arabicSize, setArabicSize] = useState(() => parseInt(localStorage.getItem('arabicSize')) || 1); 
            const [transSize, setTransSize] = useState(() => parseInt(localStorage.getItem('transSize')) || 2);
            // Varsayılan Hamdullah
            const [arabicFontId, setArabicFontId] = useState(() => localStorage.getItem('arabicFontId') || 'hamdullah'); 
            const [viewMode, setViewMode] = useState(() => localStorage.getItem('viewMode') || 'meal');
            
            const activeArabicFontClass = useMemo(
                () => ARABIC_FONTS.find(f => f.id === arabicFontId)?.className || 'font-arabic-hamdullah',
                [arabicFontId]
            );
            const currentSizes = useMemo(
                () => ({ arabicSize, transSize, arabicFontClass: activeArabicFontClass }),
                [arabicSize, transSize, activeArabicFontClass]
            );

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
            }, []);

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
                        const [fullVerse, translationsData, wordsData, versepartsData] = await Promise.all([api.getVerse(viewState.surahId, viewState.verseNum, selectedAuthor), api.getVerseTranslations(viewState.surahId, viewState.verseNum), api.getVerseWords(viewState.surahId, viewState.verseNum), api.getVerseParts(viewState.surahId, viewState.verseNum)]);
                        const filteredTranslations = (translationsData || []).filter(t => { const name = (t.author?.name || t.author || '').toLocaleLowerCase('tr-TR'); return ALLOWED_TR.some(k => name.includes(k)) || ALLOWED_EN.some(k => name.includes(k)); });
                        data = { fullVerse, translations: filteredTranslations, words: wordsData || [], verseparts: versepartsData || [] }; break;
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

            const navigateTo = useCallback((newState, pushHistory = true) => {
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
            }, []);

            const handleSearchSubmit = useCallback((e) => {
                e.preventDefault();
                const query = searchQuery.trim();
                if (query.length > 2) {
                    document.activeElement.blur();
                    navigateTo({ type: 'search', query });
                }
            }, [searchQuery, navigateTo]);

            const loadRootsForChar = useCallback(async (charId) => {
                try {
                    const roots = await api.getRootsByChar(charId);
                    setCharRoots({ charId, roots });
                } catch(err) {}
            }, []);

            const prefetchChunk = useCallback((chunkKey, loader) => {
                if (!ENABLE_INTERACTION_PREFETCH) return;
                if (prefetchedChunksRef.current.has(chunkKey)) return;
                prefetchedChunksRef.current.add(chunkKey);
                loader().catch(() => prefetchedChunksRef.current.delete(chunkKey));
            }, []);

            const prefetchSurahRoute = useCallback(() => {
                prefetchChunk('reading', () => import('./views/ReadingView.jsx'));
            }, [prefetchChunk]);

            const prefetchDictionaryRoute = useCallback(() => {
                prefetchChunk('sidebar', () => import('./views/Sidebar.jsx'));
                prefetchChunk('rootDetail', () => import('./views/RootDetailView.jsx'));
            }, [prefetchChunk]);

            const prefetchSearchRoute = useCallback(() => {
                prefetchChunk('search', () => import('./views/SearchView.jsx'));
            }, [prefetchChunk]);

            const prefetchVerseDetailRoute = useCallback(() => {
                prefetchChunk('verseDetail', () => import('./views/VerseDetailView.jsx'));
            }, [prefetchChunk]);

            return (
                <div className="flex h-screen w-full relative bg-slate-50 dark:bg-slate-950 transition-colors">
                    {/* Drawer Overlay */}
                    {sidebarOpen && <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity" onClick={() => setSidebarOpen(false)} />}

                    <Suspense fallback={null}>
                        <LazySidebar sidebarOpen={sidebarOpen} navTab={navTab} setNavTab={setNavTab} surahs={surahs} viewState={viewState} navigateTo={navigateTo} rootChars={rootChars} charRoots={charRoots} setCharRoots={setCharRoots} loadRootsForChar={loadRootsForChar} sizes={currentSizes} />
                    </Suspense>

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
                            <input type="text" value={searchQuery} onFocus={prefetchSearchRoute} onMouseEnter={prefetchSearchRoute} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Kur'an'da ara..." className="w-full bg-slate-200/70 dark:bg-slate-800/80 text-slate-900 dark:text-white text-base rounded-full pl-14 pr-6 py-4 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-emerald-500/20 transition-all placeholder-slate-500 dark:placeholder-slate-400" aria-label="Kur'an içinde ara" />
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
                            {viewState.type === 'home' && <HomeView navigateTo={navigateTo} onPrefetchSurah={prefetchSurahRoute} onPrefetchDictionary={prefetchDictionaryRoute} onOpenDictionary={() => { setSidebarOpen(true); setNavTab('dictionary'); }} />}
                            {viewState.type === 'surah' && (
                                <Suspense fallback={<LoadingView />}>
                                    <LazyReadingView viewData={viewData} navigateTo={navigateTo} sizes={currentSizes} viewMode={viewMode} onPrefetchVerseDetail={prefetchVerseDetailRoute} />
                                </Suspense>
                            )}
                            {viewState.type === 'page' && (
                                <Suspense fallback={<LoadingView />}>
                                    <LazyPageReadingView viewData={viewData} viewState={viewState} navigateTo={navigateTo} sizes={currentSizes} viewMode={viewMode} onPrefetchVerseDetail={prefetchVerseDetailRoute} />
                                </Suspense>
                            )}
                            {viewState.type === 'verse_detail' && (
                                <Suspense fallback={<LoadingView />}>
                                    <LazyVerseDetailView key={`${viewState.surahId}-${viewState.verseNum}`} viewData={viewData} viewState={viewState} navigateTo={navigateTo} sizes={currentSizes} selectedAuthor={selectedAuthor} />
                                </Suspense>
                            )}
                            {viewState.type === 'root_detail' && (
                                <Suspense fallback={<LoadingView />}>
                                    <LazyRootDetailView viewData={viewData} viewState={viewState} navigateTo={navigateTo} sizes={currentSizes} />
                                </Suspense>
                            )}
                            {viewState.type === 'search' && (
                                <Suspense fallback={<LoadingView />}>
                                    <LazySearchView viewData={viewData} viewState={viewState} navigateTo={navigateTo} sizes={currentSizes} onPrefetchVerseDetail={prefetchVerseDetailRoute} />
                                </Suspense>
                            )}
                            </div>
                        )}
                        </main>
                    </div>
                </div>
            );
        }

export default App;



