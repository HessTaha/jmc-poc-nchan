/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;
declare const clients: Clients;
declare const indexedDB: IDBFactory;
// Fonction utilitaire pour ouvrir IndexedDB
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('NotificationDB', 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('notifiedMessages')) {
        db.createObjectStore('notifiedMessages', { keyPath: 'messageId' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Vérifie si un message a déjà été notifié
async function hasMessageBeenNotified(messageId: string): Promise<boolean> {
  const db = await openDatabase();
  return new Promise<boolean>((resolve, reject) => {
    const transaction = db.transaction('notifiedMessages', 'readonly');
    const store = transaction.objectStore('notifiedMessages');
    const request = store.get(messageId);

    request.onsuccess = () => resolve(!!request.result);
    request.onerror = () => reject(request.error);
  }).finally(() => db.close());
}

// Marque un message comme notifié
async function markMessageAsNotified(messageId: string): Promise<void> {
  const db = await openDatabase();
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction('notifiedMessages', 'readwrite');
    const store = transaction.objectStore('notifiedMessages');
    const request = store.add({ messageId });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  }).finally(() => db.close());
}

// Abonnement à un canal Nchan
async function subscribeToNchan(channelUrl: string): Promise<void> {
  try {
    const response = await fetch(channelUrl, { mode: 'cors' });
    const reader = response.body?.getReader();

    if (!reader) {
      console.error('Reader non disponible pour la connexion Nchan.');
      return;
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const messages = buffer.split('\n');
      buffer = messages.pop() || '';

      for (const message of messages) {
        if (message.trim()) {
          console.log('Message Nchan reçu :', message);
          await processMessage(message);
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la souscription à Nchan :', error);
    setTimeout(() => subscribeToNchan(channelUrl), 5000);
  }
}

// Traite un message reçu
async function processMessage(message: string): Promise<void> {
  try {
    const data = JSON.parse(message);
    const { messageId, title, body, icon, url } = data;

    if (await hasMessageBeenNotified(messageId)) {
      console.log(`Message déjà notifié : ${messageId}`);
      return;
    }

    await self.registration.showNotification(title, {
      body,
      icon,
      data: { url },
    });

    await markMessageAsNotified(messageId);
    console.log(`Message notifié et enregistré : ${messageId}`);
  } catch (error) {
    console.error('Erreur lors du traitement du message :', error);
  }
}

// Écoute de l'événement "install" du service worker
self.addEventListener('install', (event: ExtendableEvent) => {
  console.log('Service Worker installé.');
  event.waitUntil(self.skipWaiting());
});

// Écoute de l'événement "activate" du service worker
self.addEventListener('activate', (event: ExtendableEvent) => {
  console.log('Service Worker activé.');
  event.waitUntil(self.clients.claim());
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  console.log('Notification cliquée.', event.notification.data);
  event.notification.close();

  event.waitUntil(
    self.clients.openWindow(event.notification.data?.url || '/')
  );
});

// Démarrage de l'abonnement au canal Nchan
subscribeToNchan('http://localhost:8081/sub?channelId=event');
