# Gerçek zkLogin Setup Kılavuzu 🔐

## 🎯 İHTİYAÇLARIMIZ

Gerçek zkLogin ve NFT minting için 3 şeye ihtiyacımız var:

### 1. **Google OAuth Client ID** (Ücretsiz)
### 2. **Enoki API Key** (Ücretsiz)
### 3. **Move Contract Package ID** (Deploy etmemiz lazım)

---

## 📋 ADIM 1: GOOGLE OAUTH CLIENT ID

### **Ne İçin Gerekli?**
Kullanıcıların Google hesabıyla giriş yapması için.

### **Nasıl Alınır?**

1. **Google Cloud Console'a git:**
   ```
   https://console.cloud.google.com/
   ```

2. **Yeni Proje Oluştur:**
   - Sol üstteki menüden "New Project" tıkla
   - Proje adı: `MemoMint` (veya istediğin bir isim)
   - "Create" tıkla

3. **OAuth Consent Screen Yapılandır:**
   - Sol menüden: APIs & Services → OAuth consent screen
   - User Type: **External** seç
   - "Create" tıkla
   
   **Bilgileri Doldur:**
   - App name: `MemoMint`
   - User support email: Kendi email'in
   - Developer contact: Kendi email'in
   - "Save and Continue"

4. **Scopes Ekle:**
   - "Add or Remove Scopes" tıkla
   - Şunları seç:
     - `openid`
     - `email`
     - `profile`
   - "Update" → "Save and Continue"

5. **Test Users Ekle:**
   - "Add Users" tıkla
   - Kendi Google email'ini ekle
   - "Save and Continue"

6. **Credentials Oluştur:**
   - Sol menüden: APIs & Services → Credentials
   - "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   
   **Önemli Kısım - Authorized redirect URIs:**
   ```
   http://localhost:5173
   http://localhost:3000
   https://enoki-oauth.mystenlabs.com/callback
   ```
   
   - "Create" tıkla

7. **Client ID'yi Kopyala:**
   - Bir popup açılacak
   - **"Client ID"** değerini kopyala
   - Güvenli bir yere kaydet!

**Örnek Client ID:**
```
1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

---

## 📋 ADIM 2: ENOKI API KEY

### **Ne İçin Gerekli?**
zkLogin'in backend'i için. Google JWT'yi Sui adresine çevirir.

### **Nasıl Alınır?**

1. **Enoki Dashboard'a git:**
   ```
   https://enoki.mystenlabs.com/
   ```

2. **Giriş Yap:**
   - Google hesabınla giriş yap

3. **Yeni Proje Oluştur:**
   - "Create New App" veya "New Project"
   - App name: `MemoMint`
   - Network: **Devnet** (test için)

4. **API Key'i Kopyala:**
   - Dashboard'da API Key gösterilecek
   - `enk_` ile başlayan bir key
   - Kopyala ve güvenli bir yere kaydet!

**Örnek API Key:**
```
enk_abc123def456ghi789jkl012mno345pqr678stu901vwx
```

5. **Redirect URL'yi Yapılandır:**
   - Settings veya Configuration bölümünde
   - Redirect URL ekle:
     ```
     http://localhost:5173
     http://localhost:3000
     ```

---

## 📋 ADIM 3: MOVE CONTRACT DEPLOY

### **Ne İçin Gerekli?**
NFT'leri mint edebilmek için smart contract blockchain'de olmalı.

### **Nasıl Deploy Edilir?**

1. **Sui CLI Kur (Eğer yoksa):**
   
   **Windows:**
   ```powershell
   # Chocolatey ile:
   choco install sui
   
   # Veya manuel:
   # https://docs.sui.io/build/install adresinden indir
   ```

2. **Sui Wallet Oluştur/Bağla:**
   ```bash
   # Yeni wallet oluştur
   sui client new-address ed25519
   
   # Veya mevcut wallet'ı import et
   sui keytool import "your-private-key" ed25519
   ```

3. **Devnet SUI Al:**
   ```bash
   # Faucet'ten SUI al (gas için)
   sui client faucet
   
   # Bakiyeni kontrol et
   sui client gas
   ```

4. **Move Paketini Yayınla:**
   ```bash
   # memomint-sui klasöründe
   cd move
   
   # Paketi derle
   sui move build
   
   # Paketi yayınla (Devnet'e)
   sui client publish --gas-budget 100000000
   ```

5. **Package ID'yi Kopyala:**
   
   Yayınlandıktan sonra şuna benzer bir çıktı göreceksin:
   ```
   ╭────────────────────────────────────────────╮
   │ Published Objects                          │
   ├────────────────────────────────────────────┤
   │ PackageID: 0x1234567890abcdef...           │
   ╰────────────────────────────────────────────╯
   ```
   
   **Bu Package ID'yi kopyala!**

---

## 📝 ADIM 4: .ENV DOSYASI OLUŞTUR

Projenin root dizininde `.env` dosyası oluştur:

```bash
# .env dosyası
VITE_GOOGLE_CLIENT_ID=1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
VITE_ENOKI_API_KEY=enk_abc123def456ghi789jkl012mno345pqr678stu901vwx
VITE_PACKAGE_ID=0x1234567890abcdef...
```

**Önemli:**
- Değerleri kendi aldığın değerlerle değiştir!
- Tırnak işareti kullanma
- Her satır yeni satır olmalı

---

## 🔧 ADIM 5: KODU GÜNCELLE

Ben sana gereken güncellemeleri yapacağım. Sadece yukarıdaki bilgileri bana ver:

```
✅ Google Client ID: 
✅ Enoki API Key: 
✅ Package ID: (contract deploy'dan sonra)
```

Bu 3 bilgiyi aldığında, ben:
1. Demo moddan çıkacağım
2. Gerçek zkLogin'i aktif edeceğim
3. NFT minting'i gerçek contract'a bağlayacağım
4. Tüm kodu update edeceğim

---

## 📋 KONTROL LİSTESİ

**Şu an yapman gerekenler:**

- [ ] Google Cloud Console'da proje oluştur
- [ ] OAuth Client ID al
- [ ] Enoki Dashboard'da hesap aç
- [ ] Enoki API Key al
- [ ] Sui CLI kur
- [ ] Sui wallet oluştur/import et
- [ ] Devnet SUI al (faucet'ten)
- [ ] Move contract'ı deploy et
- [ ] Package ID'yi kopyala
- [ ] 3 bilgiyi bana ver
- [ ] Ben kodu güncelleyeceğim ✅

---

## 💡 İPUÇLARI

### **Google Client ID için:**
- **Test Mode'da kalabilir** (production'a çıkmana gerek yok)
- Sadece kendi email'inle test edebilirsin
- Her zaman ücretsiz

### **Enoki API Key için:**
- Devnet ücretsiz ve sınırsız
- Mainnet için ücretli plan gerekebilir
- Test için Devnet yeterli

### **Move Contract için:**
- İlk publish ~5-10 dakika sürer
- Gas fee çok düşük (faucet'ten yeterli)
- Hata alırsan tekrar deneyebilirsin

---

## 🆘 YARDIM

### **Google Client ID Alamıyorsan:**
1. Google account'un doğrulanmış olmalı
2. 2FA açık olmalı (önerilir)
3. Cloud Console'a erişimin olmalı

### **Enoki Key Alamıyorsan:**
1. Sui Foundation Discord'a katıl
2. #enoki kanalında sor
3. Destek ekibi çok yardımcı

### **Contract Deploy Edilmiyorsa:**
1. Sui CLI doğru kurulu mu kontrol et: `sui --version`
2. Wallet'ta SUI var mı kontrol et: `sui client gas`
3. Move.toml dosyası doğru mu kontrol et

---

## 📞 SENDEN İHTİYACIM OLAN BİLGİLER

Hazır olduğunda bana şunları ver:

```
1. Google Client ID: _______________
2. Enoki API Key: _______________
3. Package ID: _______________ (contract deploy'dan sonra)
```

Bu bilgilerle ben:
- ✅ Demo moddan çıkaracağım
- ✅ Gerçek zkLogin yapılandıracağım
- ✅ NFT minting'i aktif edeceğim
- ✅ Tüm UI'ı güncelleyeceğim

---

## ⏰ TAHMINI SÜRELER

- **Google Client ID:** 10-15 dakika
- **Enoki API Key:** 5 dakika
- **Move Contract Deploy:** 10-15 dakika
- **Kod Güncelleme:** 5 dakika (ben yapacağım)

**Toplam:** ~30-40 dakika

---

## 🎉 SONUÇ

Bu adımları tamamladığında:
✅ Gerçek Google OAuth ile giriş yapabileceksin
✅ Gerçek Sui adresleri üretilecek
✅ NFT'ler gerçekten blockchain'de mint edilecek
✅ Explorer'da görebileceksin
✅ Production'a hazır olacak!

---

**Hazır mısın? Başlayalım! 🚀**

Hangi adımdan başlamak istersin?

