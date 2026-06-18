# Undangan Pernikahan Digital

Website undangan statis (HTML + CSS + JS, tanpa framework) bernuansa
**Batak & Katolik** — palet *cream/beige*, aksen *navy*, sentuhan *gold*.

## Struktur File
```
index.html      → struktur halaman
style.css       → desain & tema (ubah variabel di :root)
script.js       → konfigurasi & interaksi (ubah objek CONFIG)
assets/music.mp3→ (tambahkan sendiri) musik latar
```

## Cara Edit untuk Client Lain
Hampir semua konten cukup diedit di **satu tempat**: objek `CONFIG` di bagian
atas `script.js`.

| Yang diubah        | Lokasi                          |
|--------------------|---------------------------------|
| Nama mempelai      | `CONFIG.couple`                 |
| Tanggal tampil     | `CONFIG.displayDate`            |
| Target countdown   | `CONFIG.targetDate` (ISO)       |
| Akad / Pemberkatan | `CONFIG.ceremony`               |
| Resepsi            | `CONFIG.reception`              |
| Link Google Maps   | `*.mapsUrl`                     |
| Link RSVP          | `CONFIG.rsvpUrl`                |
| Hadiah / rekening  | `CONFIG.gift`                   |
| Ucapan live        | `CONFIG.firebase`               |
| Warna / font       | `:root` di `style.css`          |
| Foto galeri        | atribut `src` di `index.html`   |

## Hadiah / Amplop Digital
Section **Hadiah Pernikahan** menampilkan kartu rekening bergaya kartu kredit
(BCA & Mandiri). Edit di `CONFIG.gift` pada `script.js`:
- `cards[].number` → nomor rekening (otomatis dirapikan per 4 digit)
- `cards[].holder` → nama pemilik rekening
- `cards[].variant` → `"bca"` atau `"mandiri"` (menentukan warna kartu)
- Nomor rekening **bisa diklik untuk menyalin** otomatis.
- `whatsapp.number` → nomor WA (format internasional tanpa `+`, mis. `628xxx`)
  untuk tamu mengirim konfirmasi/bukti hadiah.

## Ucapan Live (Buku Tamu Real-time)
Section **Ucapan** memungkinkan tamu menulis ucapan/doa yang langsung tampil
dan dilihat semua orang. Backend memakai **Firebase Firestore** (gratis).

Cara mengaktifkan:
1. Buat project di https://console.firebase.google.com
2. Aktifkan **Firestore Database**
3. Buka *Project Settings → Your apps → Web app*, salin konfigurasinya
4. Tempel nilai-nilai tersebut ke `CONFIG.firebase` di `script.js`

> Jika `CONFIG.firebase` dibiarkan kosong, ucapan tetap berfungsi sebagai
> **mode demo** (disimpan di `localStorage` perangkat itu saja, tidak
> tersinkron antar tamu). Cocok untuk pratinjau sebelum setup Firebase.

Contoh aturan keamanan Firestore (izinkan baca semua, tulis terbatas):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /wishes/{doc} {
      allow read: if true;
      allow create: if request.resource.data.name is string
                    && request.resource.data.message is string;
      allow update, delete: if false;
    }
  }
}
```

## Nama Tamu via URL
Tambahkan parameter `?to=` pada URL:
```
index.html?to=Keluarga%20Besar%20Sitorus
```
Nama akan otomatis muncul di layar pembuka.

## Musik Latar
Letakkan file `music.mp3` di folder `assets/`. Karena kebijakan browser,
musik mulai diputar saat tamu menekan tombol **"Buka Undangan"**, dan dapat
dimatikan/dihidupkan lewat tombol bulat di kanan bawah.

## Library (via CDN)
- **AOS** — animasi saat scroll
- **GSAP** — animasi layar pembuka
- **Lenis** — smooth scroll
- **Swiper.js** — slider galeri
- **Firebase** — buku tamu / ucapan live (Firestore)
- **Google Fonts** — Playfair Display, Cinzel, Poppins

## Menjalankan
Buka `index.html` langsung di browser, atau jalankan server statis:
```
npx serve .
```
