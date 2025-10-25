# Sui CLI Kurulum - Windows 🚀

## 🎯 2 YÖNTEM VAR

### **Yöntem 1: Chocolatey (Kolay) - ÖNERİLEN**
### **Yöntem 2: Manuel İndirme (Alternatif)**

---

## ✅ YÖNTEM 1: CHOCOLATEY İLE (ÖNERİLEN)

### **Adım 1: Chocolatey Kurulu mu Kontrol Et**

PowerShell'de (Admin olarak) yaz:

```powershell
choco --version
```

**Eğer versiyon gösteriyorsa:** ✅ Kurulu, Adım 2'ye geç

**Eğer hata veriyorsa:** ❌ Önce Chocolatey kur:

#### **Chocolatey Kurulumu:**

1. **PowerShell'i Admin olarak aç:**
   - Başlat'a yaz: "PowerShell"
   - Sağ tıkla → "Run as Administrator"

2. **Bu komutu çalıştır:**
```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

3. **Bekle:** 1-2 dakika

4. **Kontrol et:**
```powershell
choco --version
```

---

### **Adım 2: Sui CLI Kur**

PowerShell'de (Admin olarak):

```powershell
choco install sui
```

**Sorularsa:**
- "Do you want to run the script?" → **Y** (Enter)
- "Continue?" → **Y** (Enter)

**Bekle:** 2-3 dakika

---

### **Adım 3: Kontrol Et**

```powershell
sui --version
```

**Başarılı olursa göreceksin:**
```
sui 1.x.x
```

✅ **TAMAMSA, MOVE DEPLOYMENT'A GEÇ!**

---

## 🔧 YÖNTEM 2: MANUEL KURULUM (Chocolatey çalışmazsa)

### **Adım 1: Sui Binary İndir**

1. **Browser'da aç:**
   ```
   https://github.com/MystenLabs/sui/releases
   ```

2. **Son release'i bul** (örn: v1.x.x)

3. **Windows binary'yi indir:**
   - Dosya adı: `sui-windows-x86_64.zip` veya benzeri
   - İndir ve extract et

---

### **Adım 2: PATH'e Ekle**

1. **Dosyaları bir klasöre taşı:**
   ```
   C:\Sui\
   ```
   (Bu klasörü oluştur ve .exe dosyalarını buraya koy)

2. **Windows ayarlarını aç:**
   - Başlat → "Environment Variables" yaz
   - "Edit the system environment variables" tıkla

3. **PATH'i düzenle:**
   - "Environment Variables" butonuna tıkla
   - "System variables" altında "Path" seç
   - "Edit" tıkla
   - "New" tıkla
   - `C:\Sui\` ekle
   - "OK" ile kaydet

4. **Yeni PowerShell aç** (eski olanı kapat)

5. **Kontrol et:**
```powershell
sui --version
```

---

## 🆘 SORUN GİDERME

### **Hata: "choco command not found"**
```
Çözüm: Chocolatey kurulmamış
→ Yukarıdaki Chocolatey kurulum adımlarını takip et
→ VEYA Manuel kurulum yöntemini dene
```

### **Hata: "Access denied"**
```
Çözüm: Admin yetkisi gerek
→ PowerShell'i "Run as Administrator" ile aç
→ Tekrar dene
```

### **Hata: "Execution policy"**
```
Çözüm: PowerShell execution policy kısıtlı
→ Şunu çalıştır:
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
→ Y ile onayla
→ Tekrar dene
```

### **Chocolatey kuruldu ama sui yüklemiyor**
```
Çözüm: Manuel kurulum yöntemini dene
→ GitHub'dan binary indir
→ PATH'e ekle
```

---

## 📝 KURULUM SONRASI - HEMEN YAP

Sui CLI kuruldu mu? Harika! Şimdi şunları yap:

### **1. Sui Client Başlat**
```powershell
sui client
```

İlk çalıştırmada bazı sorular soracak, hepsine "yes" de.

### **2. Devnet'e Geç**
```powershell
sui client switch --env devnet
```

### **3. Wallet Oluştur**
```powershell
sui client new-address ed25519
```

Bir adres verecek, kaydet!

### **4. SUI Al**
```powershell
sui client faucet
```

10 saniye bekle...

### **5. Kontrol Et**
```powershell
sui client gas
```

SUI görüyorsan, HAZIRSIN! 🎉

---

## 🎯 SIRA SENDE

Hangi yöntemi deneyeceksin?

**A)** "Chocolatey var, Sui kur" 
→ `choco install sui`

**B)** "Chocolatey yok, önce onu kur"
→ Yukarıdaki Chocolatey kurulum komutunu çalıştır

**C)** "Manuel kurulum yapmak istiyorum"
→ GitHub'dan binary indir

**D)** "Kurdum, çalıştı!"
→ Harika! Move deployment adımlarına geç

Söyle, hangisini yapıyorsun? 🚀

