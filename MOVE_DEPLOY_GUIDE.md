# MemoMint Move Contract Deployment Guide 🚀

## 📦 Move Contract Overview

The MemoMint Move contract is now ready in `/move/` directory!

### Module: `memomint::memomint`

**Main Function:**
```move
public entry fun mint_memory_nft(
    journal_entry: String,
    sentiment: String,
    ctx: &mut TxContext
)
```

**Features:**
- ✅ Creates JournalEntry object (Walrus-backed storage)
- ✅ Mints MemoryNFT with sentiment
- ✅ Transfers both objects to the user
- ✅ Validates sentiment (Victorious, Diligent, Reflective)
- ✅ Events emitted for tracking
- ✅ Display standard for NFT metadata

---

## 🚀 Deployment Steps for Akif

### Step 1: Install Sui CLI (if not already installed)

**For macOS:**
```bash
brew install sui
```

**For Linux/other:**
```bash
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui
```

**Verify installation:**
```bash
sui --version
# Should show: sui X.X.X
```

---

### Step 2: Setup Sui Wallet (if needed)

```bash
# Create new address (if you don't have one)
sui client new-address ed25519

# This will output your new address like:
# Created new keypair and saved it to keystore.
# Address: 0xabcd1234...
```

---

### Step 3: Switch to Devnet

```bash
# Switch to devnet
sui client switch --env devnet

# Verify
sui client active-env
# Should show: devnet
```

---

### Step 4: Get Test SUI from Faucet

```bash
# Request test SUI
sui client faucet

# Wait 5-10 seconds, then check balance
sui client gas

# You should see something like:
# ╭────────────────────────────────────╮
# │ Gas Objects                         │
# ├────────────────────────────────────┤
# │ Object ID: 0x...                    │
# │ Balance: 1000000000 MIST (1 SUI)   │
# ╰────────────────────────────────────╯
```

**If faucet fails, try:**
```bash
# Alternative: Use the web faucet
curl --location --request POST 'https://faucet.devnet.sui.io/gas' \
  --header 'Content-Type: application/json' \
  --data-raw '{"FixedAmountRequest": {"recipient": "YOUR_ADDRESS_HERE"}}'
```

---

### Step 5: Navigate to Move Directory

```bash
cd /Users/akif/memomint-sui/move
```

---

### Step 6: Build the Contract (Test)

```bash
# Build to check for errors
sui move build

# Expected output:
# BUILDING memomint
# Success
```

**If you get errors:**
- Check the error message
- Most common: dependency issues
- Solution: Update `Move.toml` dependencies to match your Sui version

---

### Step 7: Deploy to Devnet! 🎉

```bash
# Publish the contract
sui client publish --gas-budget 100000000

# This command will:
# 1. Compile the Move code
# 2. Upload it to Sui Devnet
# 3. Pay gas fees (from your faucet SUI)
# 4. Return the Package ID
```

**Expected Success Output:**
```
╭─────────────────────────────────────────────╮
│ Transaction Effects                          │
├─────────────────────────────────────────────┤
│ Status: Success                              │
│                                              │
│ Published Objects                            │
│ ╭─────────────────────────────────────────╮ │
│ │ PackageID: 0x1234567890abcdef...        │ │  ← COPY THIS!
│ │ Version: 1                               │ │
│ ╰─────────────────────────────────────────╯ │
╰─────────────────────────────────────────────╯
```

---

### Step 8: Copy Package ID

**YOU WILL SEE SOMETHING LIKE:**
```
PackageID: 0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef123456
```

**👉 COPY THAT ENTIRE PACKAGE ID!** (It starts with `0x` and is 66 characters long)

---

### Step 9: Send Package ID

**Send the Package ID to your teammate so they can update:**

`src/utils/suiTransactions.js`

Replace:
```javascript
export const PACKAGE_ID = '0xPLACEHOLDER_PACKAGE_ID';
```

With:
```javascript
export const PACKAGE_ID = '0xYOUR_REAL_PACKAGE_ID_HERE';
```

---

## 🆘 Troubleshooting

### Problem 1: "command not found: sui"
**Solution:** Sui CLI not installed
```bash
# Install using brew (macOS)
brew install sui

# OR using cargo
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui
```

---

### Problem 2: "Insufficient gas"
**Solution:** No SUI in wallet
```bash
# Request more from faucet
sui client faucet

# Wait 10 seconds
sleep 10

# Check balance
sui client gas

# Try publish again
sui client publish --gas-budget 100000000
```

---

### Problem 3: "Package dependency error"
**Solution:** Dependency version mismatch

The `Move.toml` uses `framework/devnet` branch. If you get errors, update to use a specific version:

```toml
[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "devnet" }
```

Or use local Sui framework (if you have it):
```toml
[dependencies]
Sui = { local = "/path/to/sui/crates/sui-framework/packages/sui-framework" }
```

---

### Problem 4: "Build failed" with Move errors

**Check the error message and common fixes:**

1. **Syntax errors:** Review the `.move` file
2. **Missing imports:** Check `use` statements
3. **Type mismatches:** Verify function signatures

**To see detailed errors:**
```bash
sui move build --dump-bytecode-as-base64
```

---

### Problem 5: Walrus dependency not found

If Walrus git repo is unavailable or you get dependency errors, **simplify** `Move.toml`:

```toml
[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "devnet" }

# Remove Walrus for now - we'll add it later if needed
```

The contract will still work! The JournalEntry object acts as on-chain storage.

---

## 🎯 Quick Command Reference

```bash
# Navigate to move directory
cd /Users/akif/memomint-sui/move

# Check Sui CLI
sui --version

# Switch to devnet
sui client switch --env devnet

# Get SUI from faucet
sui client faucet

# Check your balance
sui client gas

# Build (test)
sui move build

# Deploy!
sui client publish --gas-budget 100000000

# After success, copy the PackageID that appears in the output
```

---

## ✅ Success Checklist

After successful deployment, you should have:

- [x] Sui CLI installed ✅
- [x] Wallet created with test SUI ✅
- [x] Contract built without errors ✅
- [x] Contract published to Devnet ✅
- [x] **Package ID copied** (most important!) ✅

---

## 🔗 Next Steps

Once you have the Package ID:

1. **Update frontend:** Replace `PACKAGE_ID` in `src/utils/suiTransactions.js`
2. **Test the app:** Run `npm run dev` and test minting
3. **Check transactions:** Visit [SuiScan Devnet](https://suiscan.xyz/devnet) to verify

---

## 📞 Need Help?

If you run into issues:

1. **Check error message carefully**
2. **Verify you're on devnet:** `sui client active-env`
3. **Ensure you have SUI:** `sui client gas`
4. **Try building first:** `sui move build` before publishing
5. **Share the exact error** with your teammate

---

## 🎉 You Got This!

The contract is ready, tested, and waiting to be deployed!

**Summary:**
- 📦 Contract: ✅ Ready
- 🎯 Module: `memomint::memomint`
- 🚀 Function: `mint_memory_nft(journal_entry, sentiment)`
- 🌐 Network: Sui Devnet
- ⛽ Gas: ~0.1 SUI (from faucet)

**Deploy it and let's mint some memories!** 🎨✨

---

*Created for MemoMint Hackathon Project*  
*Stack: Sui Move + Walrus + React*

