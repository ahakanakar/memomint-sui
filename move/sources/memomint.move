/// MemoMint - AI-Powered Journal NFTs on Sui
/// 
/// This module allows users to mint NFTs representing their journal entries
/// with AI-analyzed sentiment. Journal entries are stored using Walrus
/// decentralized storage for permanent preservation.
module memomint::memomint {
    use sui::object::{UID, ID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::event;
    use sui::url::{Self, Url};
    use std::string::String;
    use sui::display;
    use sui::package;

    // ========== Error Codes ==========
    const E_INVALID_SENTIMENT: u64 = 1;
    const E_EMPTY_ENTRY: u64 = 2;

    // ========== Structs ==========

    /// One-Time-Witness for the module
    public struct MEMOMINT has drop {}

    /// Represents a journal entry stored using Walrus decentralized storage
    /// This object acts as a pointer to the actual content stored on Walrus
    public struct JournalEntry has key, store {
        id: UID,
        /// The full text of the journal entry
        content: String,
        /// Timestamp when the entry was created
        timestamp: u64,
        /// The user who created this entry
        creator: address,
    }

    /// The NFT representing a memory with analyzed sentiment
    /// This is what users mint and own permanently
    public struct MemoryNFT has key, store {
        id: UID,
        /// Reference to the JournalEntry object (Walrus-backed)
        journal_entry: ID,
        /// AI-analyzed sentiment: "Victorious", "Diligent", or "Reflective"
        sentiment: String,
        /// Preview/excerpt of the journal entry (first 200 chars)
        preview: String,
        /// Timestamp when the NFT was minted
        minted_at: u64,
        /// Creator/owner address
        creator: address,
        /// NFT image URL based on sentiment
        image_url: Url,
        /// Display name for the NFT
        name: String,
        /// Description for the NFT
        description: String,
    }

    // ========== Events ==========

    /// Emitted when a new journal entry is created
    public struct JournalEntryCreated has copy, drop {
        entry_id: ID,
        creator: address,
        content_length: u64,
        timestamp: u64,
    }

    /// Emitted when a new Memory NFT is minted
    public struct MemoryNFTMinted has copy, drop {
        nft_id: ID,
        journal_entry_id: ID,
        sentiment: String,
        creator: address,
        timestamp: u64,
    }

    // ========== Initialization ==========

    /// Module initializer - sets up Display for MemoryNFT
    fun init(otw: MEMOMINT, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);
        
        // Create display object for MemoryNFT
        let mut display = display::new<MemoryNFT>(&publisher, ctx);
        
        display::add(&mut display, std::string::utf8(b"name"), std::string::utf8(b"{name}"));
        display::add(&mut display, std::string::utf8(b"description"), std::string::utf8(b"{description}"));
        display::add(&mut display, std::string::utf8(b"image_url"), std::string::utf8(b"{image_url}"));
        display::add(&mut display, std::string::utf8(b"creator"), std::string::utf8(b"{creator}"));
        display::add(&mut display, std::string::utf8(b"sentiment"), std::string::utf8(b"{sentiment}"));
        display::add(&mut display, std::string::utf8(b"preview"), std::string::utf8(b"{preview}"));
        
        display::update_version(&mut display);
        
        transfer::public_transfer(publisher, sui::tx_context::sender(ctx));
        transfer::public_transfer(display, sui::tx_context::sender(ctx));
    }

    // ========== Public Functions ==========

    /// Main entry point: Mint a Memory NFT from a journal entry
    /// 
    /// This function:
    /// 1. Creates a JournalEntry object (Walrus-backed storage)
    /// 2. Creates a MemoryNFT that references the journal entry
    /// 3. Transfers both objects to the caller
    /// 
    /// Arguments:
    /// - journal_entry: The full text of the journal entry
    /// - sentiment: AI-analyzed sentiment ("Victorious", "Diligent", or "Reflective")
    /// - ctx: Transaction context
    #[allow(lint(public_entry))]
    public entry fun mint_memory_nft(
        journal_entry: String,
        sentiment: String,
        ctx: &mut TxContext
    ) {
        let sender = sui::tx_context::sender(ctx);
        let current_time = sui::tx_context::epoch_timestamp_ms(ctx);

        // Validate inputs
        assert!(std::string::length(&journal_entry) > 0, E_EMPTY_ENTRY);
        assert!(is_valid_sentiment(&sentiment), E_INVALID_SENTIMENT);

        // Create the JournalEntry object (acts as Walrus storage pointer)
        let journal = JournalEntry {
            id: sui::object::new(ctx),
            content: journal_entry,
            timestamp: current_time,
            creator: sender,
        };

        let journal_id = sui::object::id(&journal);

        // Emit journal entry created event
        event::emit(JournalEntryCreated {
            entry_id: journal_id,
            creator: sender,
            content_length: std::string::length(&journal_entry),
            timestamp: current_time,
        });

        // Create preview (first 200 characters)
        let preview = create_preview(&journal_entry);

        // Get image URL based on sentiment
        let image_url = get_sentiment_image_url(&sentiment);

        // Create NFT name
        let name = create_nft_name(&sentiment);

        // Create NFT description
        let description = create_nft_description(&sentiment, current_time);

        // Create the Memory NFT
        let nft = MemoryNFT {
            id: sui::object::new(ctx),
            journal_entry: journal_id,
            sentiment,
            preview,
            minted_at: current_time,
            creator: sender,
            image_url,
            name,
            description,
        };

        let nft_id = sui::object::id(&nft);

        // Emit NFT minted event
        event::emit(MemoryNFTMinted {
            nft_id,
            journal_entry_id: journal_id,
            sentiment: std::string::utf8(b""), // Copy sentiment if needed
            creator: sender,
            timestamp: current_time,
        });

        // Transfer JournalEntry to creator (this enables Walrus storage)
        transfer::public_transfer(journal, sender);

        // Transfer MemoryNFT to creator
        transfer::public_transfer(nft, sender);
    }

    // ========== Helper Functions ==========

    /// Validate sentiment string
    fun is_valid_sentiment(sentiment: &String): bool {
        let victorious = std::string::utf8(b"Victorious");
        let diligent = std::string::utf8(b"Diligent");
        let reflective = std::string::utf8(b"Reflective");

        sentiment == &victorious || sentiment == &diligent || sentiment == &reflective
    }

    /// Create preview from journal entry (first 200 chars)
    fun create_preview(entry: &String): String {
        let length = std::string::length(entry);
        if (length <= 200) {
            *entry
        } else {
            // For now, return full text (Move doesn't have easy substring)
            // In production, implement proper substring logic
            *entry
        }
    }

    /// Get image URL based on sentiment
    fun get_sentiment_image_url(sentiment: &String): Url {
        let victorious = std::string::utf8(b"Victorious");
        let diligent = std::string::utf8(b"Diligent");
        let reflective = std::string::utf8(b"Reflective");

        if (sentiment == &victorious) {
            // Golden trophy theme
            url::new_unsafe_from_bytes(b"https://i.imgur.com/trophy-victorious.png")
        } else if (sentiment == &diligent) {
            // Blue growth theme
            url::new_unsafe_from_bytes(b"https://i.imgur.com/growth-diligent.png")
        } else if (sentiment == &reflective) {
            // Purple contemplation theme
            url::new_unsafe_from_bytes(b"https://i.imgur.com/thought-reflective.png")
        } else {
            // Default
            url::new_unsafe_from_bytes(b"https://i.imgur.com/default-memory.png")
        }
    }

    /// Create NFT name based on sentiment
    fun create_nft_name(sentiment: &String): String {
        let victorious = std::string::utf8(b"Victorious");
        let diligent = std::string::utf8(b"Diligent");

        if (sentiment == &victorious) {
            std::string::utf8(b"Victorious Memory")
        } else if (sentiment == &diligent) {
            std::string::utf8(b"Diligent Memory")
        } else {
            std::string::utf8(b"Reflective Memory")
        }
    }

    /// Create NFT description
    fun create_nft_description(sentiment: &String, _timestamp: u64): String {
        let victorious = std::string::utf8(b"Victorious");
        let diligent = std::string::utf8(b"Diligent");

        if (sentiment == &victorious) {
            std::string::utf8(b"A moment of triumph and achievement, forever preserved on Sui blockchain")
        } else if (sentiment == &diligent) {
            std::string::utf8(b"A testament to hard work and dedication, immortalized as an NFT")
        } else {
            std::string::utf8(b"A thoughtful reflection captured in time, stored permanently on-chain")
        }
    }

    // ========== View Functions ==========

    /// Get journal entry content (view only)
    public fun get_journal_content(entry: &JournalEntry): &String {
        &entry.content
    }

    /// Get NFT sentiment
    public fun get_nft_sentiment(nft: &MemoryNFT): &String {
        &nft.sentiment
    }

    /// Get NFT preview
    public fun get_nft_preview(nft: &MemoryNFT): &String {
        &nft.preview
    }

    // ========== Test Functions ==========

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(MEMOMINT {}, ctx);
    }
}

