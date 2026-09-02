import React, { createContext, useContext, useEffect, useState } from 'react';
import { InstituteSettings } from '../types';
import { api } from '../services/api';

interface SettingsContextType {
  settings: InstituteSettings | null;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<InstituteSettings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const emptySettings: InstituteSettings = {
  general: { instituteName: '', shortName: '', fullName: '', alternativeName: '', parentOrganization: '', tagline: '', motto: '', description: '', shortDescription: '', institutionType: '', logoUrl: '', faviconUrl: '' },
  contact: { primaryPhone: '', secondaryPhone: '', additionalPhone: '', email: '', supportEmail: '', address: '', street: '', junction: '', area: '', city: '', state: '', country: '', googleMapsEmbedUrl: '', openingHours: '' },
  whatsapp: { primaryNumber: '', secondaryNumber: '', defaultMessage: '', floatingEnabled: false },
  branding: { primaryColor: '', secondaryColor: '', accentColor: '', showMottoOnHeader: false },
  admissions: { activeSession: '', applicationStatus: 'closed', applicationFee: 0, certificateTuition: 0, diplomaTuition: 0, acceptanceFee: 0, applicationOpeningDate: '', applicationDeadline: '', orientationDate: '', programStartDate: '', certificateRequirements: [], diplomaRequirements: [] },
  documents: { authorizedSignatoryName: '', authorizedSignatoryTitle: '', signatorySignatureUrl: '', officialStampUrl: '', admissionLetterHeader: '', certificateTitle: '' },
  socialMedia: { facebook: '', instagram: '', tiktok: '', youtube: '', linkedin: '', twitterX: '' },
  numbering: { applicationPrefix: '', admissionPrefix: '', studentPrefix: '', certificatePrefix: '', invoicePrefix: '', receiptPrefix: '' },
  integrations: { paystackPublicKey: '', flutterwavePublicKey: '', enableLivePayments: false, smsSenderId: '' },
  pricing: { publicPriceDisplay: 'quote_only', displayDisclaimer: false, allowWhatsappQuotes: false, allowDirectCalls: false, quoteExpiryDaysDefault: 0, showApplicationFee: 'on_request' }
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<InstituteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings();
      setSettings(data || emptySettings);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load institute settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<InstituteSettings>) => {
    try {
      const updated = await api.updateSettings(newSettings);
      setSettings(updated);
    } catch (err: any) {
      throw err;
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
