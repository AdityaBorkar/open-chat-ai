* Commands:
"_sync check" -> check all files
"_sync studio" -> Visualize Graph
"_sync publish --new" -> generate a new migration
"_sync publish --update" -> update the existing latest migration
"_sync rollback -v 1.0.0" -> Cancel the version propagation

* Remember:

Role of the ORM Adapter:
- SQL generation
- Migrations
- Skew Protection


Triggers: Use PostgreSQL triggers to auto-update last_modified/version on INSERT/UPDATE.

// local-changes

// Client Queue: Store pending changes locally (e.g., IndexedDB/SQLite) when offline.
// Server sends changes created during client's offline period.
// Table change → Trigger → NOTIFY "user_{id}" → Application pushes via WebSocket

// Always filter by user_id in server queries.
// Row-level security (RLS) in PostgreSQL for secondary protection.

// Selective Sync: Sync only modified columns, not entire rows.
// Batching: Group changes (e.g., 100ms windows) to reduce network traffic.
// Compression: Compress WebSocket payloads (e.g., Protocol Buffers).

// Retries: Exponential backoff for failed syncs.
// Real-Time Layer: WebSocket libraries (Socket.IO, ws) with Redis for scaling.

// Client sends its current sync state metadata to server:
// last_successful_sync timestamp (null if first sync)
// Max local version or last_modified value per entity type
// Client record checksums (SHA-256 hashes of record IDs + versions)

// SELECT * FROM user_data
// WHERE user_id = :userId
//   AND (last_modified > :clientMaxModified
//        OR id NOT IN (:clientRecordIds)
//        OR is_deleted = true)

// New records: Missing on client
// Updated records: Server version > client version
// Tombstones: Records deleted on server