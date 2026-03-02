export const API_BASE_URL = 'https://api.acikkuran.com';

export const DEFAULT_AUTHOR_ID = 105;
export const ALLOWED_TR = ['diyanet', 'elmalılı', 'elmalili', 'ibni kesir', 'ibn kesir', 'ibn-i kesir', 'hasan basri'];
export const ALLOWED_EN = ['khattab', 'haleem', 'usmani', 'bewley', 'pickthall', 'yusuf ali', 'maududi'];

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
        const result = json.meta || json.links ? json : json.data !== undefined ? json.data : json;
        this.cache.set(endpoint, result);
        return result;
      } finally {
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

export const api = new ApiService();
