import React, { useState, useEffect } from 'react';

const ServiceWorkerToggle: React.FC = () => {
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);

  useEffect(() => {
    // Vérifie si un service worker est actuellement actif
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        setIsServiceWorkerRegistered(!!registration);
      });
    }
  }, []);

  // Fonction pour activer le service worker
  const enableServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered:', registration);
        setIsServiceWorkerRegistered(true);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    } else {
      console.warn('Service workers are not supported in this browser.');
    }
  };

  // Fonction pour désactiver le service worker
  const disableServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        console.log('Service Worker unregistered.');
        setIsServiceWorkerRegistered(false);
      } else {
        console.log('No active service worker found.');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Gestion du Service Worker</h1>
      <p>
        {isServiceWorkerRegistered
          ? 'Le Service Worker est actuellement activé.'
          : 'Le Service Worker est désactivé.'}
      </p>
      <button
        onClick={isServiceWorkerRegistered ? disableServiceWorker : enableServiceWorker}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: isServiceWorkerRegistered ? '#ff4d4d' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        {isServiceWorkerRegistered ? 'Désactiver le Service Worker' : 'Activer le Service Worker'}
      </button>
    </div>
  );
};

export default ServiceWorkerToggle;
