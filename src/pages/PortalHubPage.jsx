import React from 'react';
import { ConnoisseurStackInteractor } from '../components/ui/connoisseur-stack-interactor';

export default function PortalHubPage() {
  return (
    <div className="portal-hub-page" style={{ backgroundColor: '#030303', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <ConnoisseurStackInteractor />
    </div>
  );
}
