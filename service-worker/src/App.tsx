import React from 'react';
import ServiceWorkerToggle from './components/ServiceWorkerToggle';

const App: React.FC = () => {
  return (
    <div>
      <h1>Mon Application</h1>
      <ServiceWorkerToggle />
    </div>
  );
};

export default App;
