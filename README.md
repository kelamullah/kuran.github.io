# 📖 Kur'ân-ı Kerîm

Modern, hızlı ve tamamen tek dosyadan (**Single-Page**) oluşan kapsamlı bir Kur'an-ı Kerim okuma ve tahlil web uygulaması. Geleneksel Mushaf okuma deneyimini, **Material You (Android 17)** tasarım diliyle birleştirerek akıcı bir dijital deneyim sunar.

---

## ✨ Özellikler

### 🕋 Çok Yönlü Okuma Deneyimi

* **Çift Okuma Modu:** * *Meal Modu:* Ayetleri alt alta, çevirileri ve analiz araçlarıyla listeleyin.
* *Mushaf Modu:* Geleneksel sayfa düzeninde (text-justify), odaklanmış blok okuma.


* **Özelleştirilebilir Tipografi:** * Arapça ve Türkçe metinler için bağımsız font boyutu (A+ / A-) ayarı.
* **3 Özel Font:** Hamdullah (Varsayılan), Abay, Latif ve standart Google Amiri desteği.



### 🔍 Derinlemesine Tahlil ve Araştırma

* **Gelişmiş Analiz:** Ayet bazlı kelime kelime meal, gramer (sarf/nahiv) tahlili ve karşılaştırmalı mealler.
* **Kök Sözlüğü:** Arapça köklere (sülasi vb.) göre arama; kökün geçtiği tüm ayetlerin ve kullanım istatistiklerinin listelenmesi.
* **Sesli Dinleme:** Sure ve sayfaları yüksek kaliteli MP3 formatında dinleyebilme.

### 🛠️ Akıllı Teknolojiler

* **Material You Tasarımı:** Dinamik renk geçişleri, yuvarlak hatlar ve göz yormayan arayüz.
* **Kusursuz Karanlık Mod:** Sistem tercihiyle uyumlu veya manuel geçişli gece modu.
* **Akıllı Hafıza & Performans:** * `localStorage` ile kalınan yeri hatırlama.
* `History API` ile tarayıcı düğmeleriyle tam uyum.
* `API Caching` ile ışık hızında sayfa geçişleri.



---

## 🚀 Kurulum ve Çalıştırma

Bu proje **"Tek Dosya Mimarisi"** ile geliştirilmiştir. Karmaşık Node.js süreçlerine veya `npm install` komutlarına ihtiyaç duymaz.

1. Projeyi indirin veya klonlayın.
2. Aşağıdaki font dosyalarının `index.html` ile aynı dizinde olduğundan emin olun:
* `KuranKerimFontAbay.ttf`
* `KuranKerimFontLatif.ttf`
* `KuranKerimFontHamdullah.ttf`


3. `index.html` dosyasını modern bir tarayıcıda (Chrome, Edge, Safari vb.) açın.

> [!TIP]
> Proje statik yapıda olduğu için **GitHub Pages**, **Vercel** veya **Netlify** üzerinde saniyeler içinde yayına alınabilir.

---

## 🛠️ Kullanılan Teknolojiler

| Bileşen | Teknoloji | Kullanım Amacı |
| --- | --- | --- |
| **Mantık & UI** | React.js (via CDN) | State yönetimi ve dinamik arayüz. |
| **Stil** | Tailwind CSS (via CDN) | Modern, responsive ve hızlı tasarım. |
| **Derleme** | Babel (Standalone) | Tarayıcı içi JS modernizasyonu. |
| **Veri Kaynağı** | [Açık Kuran API](https://www.google.com/search?q=https://api.acikkuran.com) | Ayet, meal, sözlük ve gramer verileri. |

---

## 📁 Dosya Yapısı

```text
/
├── index.html                   # Ana uygulama (UI, Logic ve CSS tek dosyada)
├── KuranKerimFontAbay.ttf       # Özel Arapça Font (Abay)
├── KuranKerimFontLatif.ttf      # Özel Arapça Font (Latif)
├── KuranKerimFontHamdullah.ttf  # Özel Arapça Font (Hamdullah)
└── README.md                    # Proje dökümantasyonu

```

---

## 🤝 Veri Kaynağı ve Lisans

* **Veri:** Tüm içerik **Açık Kuran API** üzerinden sağlanmaktadır. Varsayılan meal *Hasan Basri Çantay*'a aittir; ancak ayarlar menüsünden onlarca farklı mütercim seçilebilir.
* **Lisans:** Bu proje, topluma fayda sağlama ve kişisel gelişim amacıyla **Açık Kaynak** olarak sunulmuştur.