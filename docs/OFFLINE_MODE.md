# Offline Mode Documentation

T3 Chat includes comprehensive offline functionality that allows users to continue chatting even when disconnected from the internet.

## Features

### 🔄 **Background Sync**
- Messages sent while offline are automatically queued
- When connection is restored, queued messages sync automatically
- Background sync ensures no conversations are lost

### 💾 **Local Storage**
- Conversations and messages stored locally using IndexedDB
- Settings and preferences cached offline
- Complete chat history available without internet

### ⚡ **Smart Caching**
- Static assets cached for fast loading
- API responses cached with network-first strategy
- Images and fonts cached for offline viewing

### 📡 **Connection Awareness**
- Real-time online/offline status indicator
- Visual feedback for sync status
- Automatic retry mechanisms

## How It Works

### Service Worker
The app uses a service worker (`/public/sw.js`) that:
- Intercepts network requests
- Implements caching strategies
- Manages background sync
- Provides offline fallbacks

### IndexedDB Storage
Local data is stored in IndexedDB with these collections:
- `conversations` - Chat conversations
- `messages` - Individual messages
- `pendingRequests` - Failed requests for sync
- `offlineSettings` - App preferences

### Background Sync
When offline:
1. User sends message
2. Message stored locally
3. Request added to sync queue
4. When online, background sync retries
5. Success/failure notifications sent to UI

## Usage

### Offline Indicators
- **Green dot**: Online and synced
- **Yellow dot**: Syncing pending messages
- **Red dot**: Offline

### Manual Actions
- **Force Sync**: Click retry button to manually sync
- **Clear Offline Data**: Available in settings
- **Export/Import**: Backup offline conversations

## Implementation Files

```
public/
├── sw.js                    # Service worker with caching logic
├── manifest.json           # PWA manifest

src/lib/
├── service-worker.ts       # SW registration & utilities
├── offline-storage.ts      # IndexedDB wrapper

src/components/ui/
└── OfflineIndicator.tsx    # Status UI components
```

## API Integration

The offline system works with your existing API routes:

```typescript
// Enhanced fetch with offline handling
import { offlineFetch } from '@/lib/service-worker';

const response = await offlineFetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ message })
});
```

## Configuration

### Cache Strategy
Configure cache behavior in `/public/sw.js`:

```javascript
// Static assets - Stale While Revalidate
// API routes - Network First (5s timeout)
// Images - Cache First
// Navigation - Network First with offline fallback
```

### Background Sync
Sync happens automatically but can be triggered:

```typescript
import { swManager } from '@/lib/service-worker';

// Force sync
await swManager.forceSync();

// Listen for sync events
swManager.on('SYNC_SUCCESS', (data) => {
  console.log('Synced:', data.url);
});
```

## Testing Offline Mode

### Chrome DevTools
1. Open DevTools → Network tab
2. Check "Offline" to simulate no connection
3. Use the app normally - messages will queue
4. Uncheck "Offline" to see background sync

### Real Device Testing
1. Turn off WiFi/cellular on device
2. Use app - notice offline indicators
3. Reconnect to see sync in action

## Performance

### Storage Limits
- IndexedDB: ~50MB on most devices
- Service Worker Cache: ~50MB additional
- Automatic cleanup of old cache entries

### Battery Impact
- Background sync uses minimal battery
- Only activates when network available
- Respects system battery optimizations

## Browser Support

### Required Features
- Service Workers (93% browser support)
- IndexedDB (96% browser support)
- Background Sync (Chrome, Edge, Samsung Internet)
- Cache API (91% browser support)

### Fallbacks
- LocalStorage fallback for settings
- Manual sync buttons when background sync unavailable
- Graceful degradation for unsupported browsers

## Troubleshooting

### Common Issues

**Messages not syncing:**
- Check network connection
- Force sync via UI retry button
- Clear service worker cache in DevTools

**Offline indicator stuck:**
- Refresh page to re-register service worker
- Check DevTools → Application → Service Workers

**Storage full:**
- Export conversations to backup
- Clear offline data in settings
- Browser will show quota warnings

### Debug Mode

Enable debug logging:

```javascript
// In browser console
localStorage.setItem('debug-sw', 'true');
```

## Security Considerations

- All data encrypted in IndexedDB where supported
- API keys stored securely in browser storage
- No sensitive data cached in service worker
- HTTPS required for service worker functionality

## Future Enhancements

- [ ] Conflict resolution for simultaneous edits
- [ ] P2P sync between devices
- [ ] Selective sync settings
- [ ] Advanced cache management UI
- [ ] Voice message offline support