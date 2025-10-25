# Move Contract Deploy - Basit Anlatım 🚀

## 🎯 AMAÇ

Move contract'ı Sui blockchain'e yüklemek. Bu sayede NFT'leri gerçekten mint edebileceğiz.

---

## ⚠️ ÖNCELİKLE KONTROL

### **1. Sui CLI Kurulu mu?**

Terminalde şunu dene:

```powershell
sui --version
```

**Eğer çalışıyorsa:** ✅ Kurulu, devam et!

**Eğer hata veriyorsa:** ❌ Kurulu değil, şimdi kuralım:

```powershell
# Windows için (PowerShell - Admin olarak çalıştır):

# Chocolatey ile:
choco install sui

# VEYA Manuel kurulum:
# 1. https://github.com/MystenLabs/sui/releases adresine git
# 2. Son release'i indir (Windows .exe)
# 3. PATH'e ekle
```

**Kurulum sonrası tekrar kontrol:**
```powershell
sui --version
# Çıktı: sui 1.x.x gibi bir şey görmeli
```

---

## 📋 ADIM ADIM DEPLOYMENT

### **Adım 1: Sui Wallet Oluştur (İlk defa yapıyorsan)**

```powershell
# Yeni bir adres oluştur
sui client new-address ed25519
```

**Çıktı şuna benzer:**
```
Created new keypair and saved it to keystore.
Address: 0xabcd1234...
```

Bu adresi bir yere kaydet!

---

### **Adım 2: Devnet'e Bağlan**

```powershell
# Devnet'e geç
sui client switch --env devnet
```

**Doğrula:**
```powershell
sui client active-env
# Çıktı: devnet
```

---

### **Adım 3: SUI Al (Gas için)**

```powershell
# Faucet'ten ücretsiz SUI al
sui client faucet
```

**Bekle:** 5-10 saniye bekle

**Kontrol et:**
```powershell
sui client gas
```

**Çıktı şöyle olmalı:**
```
╭────────────────────────────────────╮
│ Gas Objects                         │
├────────────────────────────────────┤
│ Object ID: 0x...                    │
│ Balance: 1000000000 MIST (1 SUI)   │
╰────────────────────────────────────╯
```

Eğer SUI görüyorsan, harikasın! Devam et!

---

### **Adım 4: Move Dizinine Git**

```powershell
# Projenin move klasörüne git
cd "c:\Users\ahmet hakan\memomint-sui\move"
```

**Kontrol et:**
```powershell
# Move.toml dosyası var mı?
ls
# Görmelisin: Move.toml, sources klasörü
```

---

### **Adım 5: Contract'ı Derle (Test)**

```powershell
# Önce derleme yap (hata var mı kontrol)
sui move build
```

**Başarılı olursa:**
```
BUILDING memomint
```

**Hata alırsan:** Kodu bana göster, düzeltelim

---

### **Adım 6: Contract'ı Yayınla! 🚀**

```powershell
# Contract'ı Devnet'e yayınla
sui client publish --gas-budget 100000000
```

**Bu komut:**
- Contract'ı blockchain'e yükler
- Gas fee öder (faucet'ten aldığın SUI ile)
- Package ID verir

**Beklenen Çıktı (Önemli!):**
```
╭─────────────────────────────────────────────╮
│ Transaction Effects                          │
├─────────────────────────────────────────────┤
│ Status: Success                              │
│                                              │
│ Published Objects                            │
│ ╭─────────────────────────────────────────╮ │
│ │ PackageID: 0x1234567890abcdef...        │ │
│ │ Version: 1                               │ │
│ ╰─────────────────────────────────────────╯ │
╰─────────────────────────────────────────────╯
```

**ÖNEMLİ:** `PackageID: 0x...` kısmını KOPYALA!

---

## 📝 PACKAGE ID'Yİ BANA VER

Contract yayınlandığında şöyle bir şey göreceksin:

```
PackageID: 0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456
```

Bu uzun, 0x ile başlayan kodu bana ver!

---

## 🆘 OLASI SORUNLAR VE ÇÖZÜMLER

### **Sorun 1: "sui command not found"**
```
Çözüm: Sui CLI kurulu değil
→ Yukarıdaki kurulum adımlarını takip et
```

### **Sorun 2: "Insufficient gas"**
```
Çözüm: Cüzdanda SUI yok
→ sui client faucet
→ 10 saniye bekle
→ sui client gas ile kontrol et
→ Tekrar dene
```

### **Sorun 3: "Build failed"**
```
Çözüm: Move kodunda hata var
→ Hata mesajını bana gönder
→ Ben düzelteyim
```

### **Sorun 4: "Not connected to devnet"**
```
Çözüm: Yanlış network'te
→ sui client switch --env devnet
→ sui client active-env ile kontrol et
```

### **Sorun 5: "Permission denied"**
```
Çözüm: Admin yetkisi gerek
→ PowerShell'i "Run as Administrator" ile aç
→ Tekrar dene
```

---

## 🎯 ÖZET - HIZLI KOMUTLAR

Eğer her şey hazırsa, sadece şunları çalıştır:

```powershell
# 1. Dizine git
cd "c:\Users\ahmet hakan\memomint-sui\move"

# 2. Devnet'e bağlan
sui client switch --env devnet

# 3. SUI al
sui client faucet

# 4. 10 saniye bekle...

# 5. Yayınla!
sui client publish --gas-budget 100000000

# 6. Package ID'yi kopyala ve bana ver!
```

---

## 💬 BANA SÖYLE

Şu anda hangi aşamadasın?

**Seçenek 1:** "Sui CLI kurulu değil, nasıl kurarım?"
→ Adım adım kurulum yapalım

**Seçenek 2:** "Sui CLI kurulu, wallet yok"
→ Wallet oluşturalım

**Seçenek 3:** "Her şey hazır, sadece publish edeceğim"
→ Harika! Komutları çalıştır, Package ID'yi ver

**Seçenek 4:** "Hata aldım: [hata mesajı]"
→ Hata mesajını söyle, çözelim

**Seçenek 5:** "Package ID aldım: 0x..."
→ Mükemmel! Ver bana, devam edelim!

---

## 📸 PACKAGE ID ÖRNEK

Başarılı olursa şöyle bir şey göreceksin:

```
╭──────────────────────────────────────╮
│ Published Objects                     │
├──────────────────────────────────────┤
│ PackageID: 0x1a2b3c4d5e6f...        │  ← BU!
│ Version: 1                            │
╰──────────────────────────────────────╯
```

O uzun 0x... kodunu bana ver!

---

## ✅ SONUÇ

Bu adım tamamlandığında:
- ✅ Contract blockchain'de olacak
- ✅ Package ID'yi alacaksın
- ✅ Bana vereceksin
- ✅ Ben kodu güncelleyeceğim
- ✅ NFT minting çalışacak!

**Hazır mısın? Hangi aşamadasın? 🚀**

