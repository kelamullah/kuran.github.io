import { useMemo } from 'react';

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

export default function Sidebar({ sidebarOpen, navTab, setNavTab, surahs, viewState, navigateTo, rootChars, charRoots, setCharRoots, loadRootsForChar, sizes }) {
  const pageNumbers = useMemo(() => Array.from({ length: 604 }, (_, i) => i + 1), []);

  return (
    <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-80 bg-slate-100 dark:bg-slate-900 transform transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="mt-20 lg:mt-6 mx-4 mb-4">
        <div className="flex bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-full">
          {['surahs', 'pages', 'dictionary'].map((tab) => (
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
              );
            })}
          </div>
        )}

        {navTab === 'pages' && (
          <div className="p-2">
            <div className="mb-6 flex space-x-2 bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-full">
              <input type="number" id="pageJump" min="1" max="604" placeholder="Sayfa (1-604)" className="flex-1 bg-transparent px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none font-bold placeholder-slate-400" onKeyDown={(e) => { if(e.key === 'Enter' && e.target.value) navigateTo({ type: 'page', pageNum: parseInt(e.target.value) }, true); }} />
              <button onClick={() => { const val = document.getElementById('pageJump').value; if(val) navigateTo({ type: 'page', pageNum: parseInt(val) }, true); }} className="bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 px-6 py-2.5 rounded-full text-sm font-bold shadow-sm transition-colors hover:text-emerald-800 dark:hover:text-emerald-200">Git</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {pageNumbers.map((p) => {
                const isActive = viewState.type === 'page' && viewState.pageNum === p;
                return (
                  <button key={p} onClick={() => navigateTo({ type: 'page', pageNum: p }, true)} className={`p-3 text-sm rounded-full transition-all ${isActive ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-medium'}`}>
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {navTab === 'dictionary' && (
          <div className="p-2 mt-2">
            {charRoots ? (
              <div className="slide-up">
                <button onClick={() => setCharRoots(null)} className="mb-6 text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 flex items-center bg-slate-200 dark:bg-slate-800 px-5 py-3 rounded-full w-full justify-center transition-colors">
                  <ChevronLeft className="w-5 h-5 mr-1" /> Harflere Dön
                </button>
                <div className="space-y-2">
                  {charRoots.roots?.map((root) => (
                    <button key={root.id} onClick={() => navigateTo({ type: 'root_detail', latin: root.latin, page: 1 }, true)} className="w-full text-left px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-full flex justify-between items-center transition-all hover:bg-slate-200 dark:hover:bg-slate-700 group">
                      <span className="font-bold text-slate-700 dark:text-slate-200 text-lg group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{root.latin}</span>
                      <span className={`${sizes.arabicFontClass} text-2xl text-slate-800 dark:text-slate-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400`}>{root.arabic}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2" dir="rtl">
                {rootChars?.map((char) => (
                  <button key={char.id} onClick={() => loadRootsForChar(char.id)} className={`p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-emerald-700 dark:hover:text-emerald-400 ${sizes.arabicFontClass} text-3xl text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center`}>
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
}
