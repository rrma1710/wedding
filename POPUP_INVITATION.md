# Popup Undangan dengan Musik Otomatis

## Deskripsi Fitur

Kami telah membuat popup undangan yang muncul otomatis ketika pengunjung membuka website pernikahan Zahra & Akbar. Popup ini memiliki fitur-fitur berikut:

### ✨ Fitur Utama

1. **Popup Undangan Otomatis**
   - Muncul secara otomatis saat halaman pertama kali dibuka
   - Animasi smooth dengan spring effect saat opening
   - Desain elegan dengan gradient background dan glass-morphism effect

2. **Musik Otomatis**
   - Musik mulai diputar otomatis ketika popup dibuka
   - User dapat mengontrol musik melalui tombol di header
   - Musik terus berjalan saat popup ditutup

3. **Interaktif**
   - Tombol "Lihat Undangan" untuk menutup popup dan melihat halaman utama
   - Tombol "Musik On" untuk quick access ke kontrol musik
   - Tombol close (X) di sudut kanan atas
   - Dapat dibuka kembali dengan mengklik nama "Zahra & Akbar" di header

4. **Visual Effects**
   - Heart icon yang berrotasi
   - Decorative elements dengan blur effects
   - Smooth transitions dan animations
   - Responsive design (mobile, tablet, desktop)

## File yang Ditambahkan

### `/src/components/InvitationPopup.tsx`
Component reusable untuk menampilkan popup undangan dengan semua fitur animasi dan interaksi.

**Props:**
- `isOpen: boolean` - Kontrol visibility popup
- `onClose: () => void` - Callback saat popup ditutup
- `audioRef: React.RefObject<HTMLAudioElement | null>` - Reference ke audio element
- `onPlayMusic?: () => void` - Callback saat musik diputar

## Perubahan pada File Existing

### `/src/App.tsx`

1. **Import InvitationPopup**
   ```typescript
   import { InvitationPopup } from './components/InvitationPopup';
   ```

2. **State Management**
   ```typescript
   const [isInvitationOpen, setIsInvitationOpen] = useState(true);
   ```

3. **Render Popup**
   ```typescript
   <InvitationPopup
     isOpen={isInvitationOpen}
     onClose={() => setIsInvitationOpen(false)}
     audioRef={audioRef}
     onPlayMusic={() => {
       setHasUserInteracted(true);
       setIsMusicPlaying(true);
     }}
   />
   ```

4. **Header Update**
   - Nama "Zahra & Akbar" menjadi clickable button untuk membuka kembali popup
   - Tetap memiliki tombol musik control di sebelah kanan

## Customization

### Mengubah Teks Undangan

Edit file `/src/components/InvitationPopup.tsx` dan ubah bagian berikut:

```typescript
<h1 className="text-5xl sm:text-6xl font-serif text-burgundy mb-2">
  Zahra & Akbar
</h1>

<p className="text-sm sm:text-base tracking-[0.3em] font-semibold text-charcoal/60 uppercase">
  Dengan hormat mengundang Anda
</p>
```

### Mengubah Warna

Semua warna menggunakan Tailwind CSS classes. Yang utama:
- `burgundy` - Warna merah/coklat untuk heading
- `sage` - Warna hijau untuk accent
- `champagne` - Warna krem untuk background

Edit di file dan ganti class names sesuai kebutuhan atau update `tailwind.config.js`.

### Mengubah Durasi Animasi

Ubah nilai `duration` dan `transition` di komponen:

```typescript
// Opening animation
initial={{ scale: 0.85, opacity: 0, y: 30 }}
animate={{ scale: 1, opacity: 1, y: 0 }}
transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 30 }}
```

### Disable Popup Otomatis

Jika ingin popup hanya muncul atas interaksi user, ubah di `App.tsx`:

```typescript
// Dari:
const [isInvitationOpen, setIsInvitationOpen] = useState(true);

// Menjadi:
const [isInvitationOpen, setIsInvitationOpen] = useState(false);

// Dan tambahkan button di hero section untuk membuka:
<button onClick={() => setIsInvitationOpen(true)}>
  Buka Undangan
</button>
```

## Technical Details

### Animasi menggunakan Framer Motion
- Spring physics untuk smooth opening
- Staggered animations untuk elemen-elemen
- Gesture animations untuk buttons

### Audio Control
- Musik diputar otomatis saat popup dibuka
- Audio reference di-pass dari parent component
- Musik terus berjalan di background

### Z-index Management
- Popup: `z-[999]` (paling tinggi)
- Header: `z-50`
- Regular content: `z-0` (default)

### Responsive Design
- Mobile: Full width dengan padding
- Tablet: Max-width 2xl dengan responsif font
- Desktop: Centered dengan shadow effect

## Testing

Untuk test fitur:

1. **Buka website**: Popup muncul otomatis
2. **Klik "Lihat Undangan"**: Popup close, musik tetap jalan
3. **Klik nama "Zahra & Akbar"**: Popup buka kembali
4. **Klik tombol musik**: Toggle on/off
5. **Mobile**: Test responsiveness dengan berbagai ukuran layar

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support (iOS Safari, Chrome Android)

## Performance Tips

- Popup menggunakan CSS transitions (optimal performance)
- Audio preload="auto" untuk performa musik
- Lazy loading untuk images di gallery

---

**Created:** May 18, 2026
**Version:** 1.0
