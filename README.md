# 📖 Kur'ân-ı Kerîm

Kur'ân-ı Kerîm okuma, tahlil ve kök sözlüğü deneyimi sunan React tabanlı web uygulaması.

## ✨ Öne Çıkanlar

- Meal ve Mushaf odaklı okuma modları
- Ayet detayları, kelime/kök inceleme akışları
- Açık Kuran API entegrasyonu
- Karanlık mod ve tipografi özelleştirmeleri

## 🧱 Teknoloji

- React 19
- Vite 6
- Tailwind CSS 4
- PostCSS + Autoprefixer

## 📁 Proje Yapısı

```text
/
├── index.html
├── src/
│   ├── main.jsx
│   └── styles.css
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🚀 Geliştirme

> Bu sürüm, önceki tek dosya/CDN mimarisinden **Vite + modüler kaynak** yapısına taşınmıştır.

1. Node.js 18+ kur
2. Bağımlılıkları yükle:
   - `npm install`
3. Geliştirme sunucusunu başlat:
   - `npm run dev`
4. Production build al:
   - `npm run build`
5. Build önizleme:
   - `npm run preview`

### NPM Scriptleri

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run lint` | ESLint ile kod kalitesi kontrolü yapar |
| `npm run lint:fix` | Düzeltilebilir lint sorunlarını otomatik düzeltir |
| `npm run typecheck` | TypeScript tabanlı no-emit tip/konfigürasyon kontrolü yapar |
| `npm run check` | Lint + typecheck + build zincirini birlikte çalıştırır |
| `npm run clean` | `dist` klasörünü temizler |
| `npm run build:only` | Sadece Vite production build alır |
| `npm run build` | Önce temizler, sonra production build alır |
| `npm run preview` | Build çıktısını yerelde önizler |

Not: Bu komutlar için Node.js 18+ önerilir.

Örnek geliştirme akışı: `npm install` → `npm run dev`

Örnek yayın öncesi kontrol: `npm run build` → `npm run preview`

## 🚀 GitHub Pages Yayını

Bu proje Vite kullandığı için, GitHub Pages üzerinde kaynak dosyayı (`/src/main.jsx`) doğrudan servis etmek boş ekran oluşturur.

Repo içinde bulunan workflow dosyası build alıp `dist/` klasörünü yayınlar:

- `.github/workflows/deploy-pages.yml`

Gerekli ayar:

1. GitHub → Settings → Pages
2. Source olarak **GitHub Actions** seç
3. `main` branch'e push yapınca otomatik deploy başlar

## 🔤 Font Dosyaları

Aşağıdaki dosyalar `public/fonts/` klasöründe bulunmalıdır:

- `public/fonts/KuranKerimFontAbay.ttf`
- `public/fonts/KuranKerimFontLatif.ttf`
- `public/fonts/KuranKerimFontHamdullah.ttf`

## 🌐 Veri Kaynağı

Tüm içerik Açık Kuran API üzerinden sağlanır: `https://api.acikkuran.com`
