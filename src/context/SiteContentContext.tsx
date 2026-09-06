import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SiteContentService, 
  DEFAULT_SITE_CONTENT, 
  type SiteContentConfig 
} from '../services/siteContentService';

interface SiteContentContextType {
  content: SiteContentConfig;
  isLoading: boolean;
  updateContent: (newContent: SiteContentConfig) => void;
  publishContent: (newContent: SiteContentConfig) => Promise<boolean>;
  resetToDefaults: () => SiteContentConfig;
  reloadContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType>({
  content: DEFAULT_SITE_CONTENT,
  isLoading: true,
  updateContent: () => {},
  publishContent: async () => false,
  resetToDefaults: () => DEFAULT_SITE_CONTENT,
  reloadContent: async () => {}
});

export const SiteContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContentConfig>(() => SiteContentService.getSiteContent());
  const [isLoading, setIsLoading] = useState(true);

  const reloadContent = async () => {
    setIsLoading(true);
    const remote = await SiteContentService.fetchRemoteContent();
    setContent(remote);
    setIsLoading(false);
  };

  useEffect(() => {
    reloadContent();
  }, []);

  const updateContent = (newContent: SiteContentConfig) => {
    SiteContentService.setSiteContent(newContent);
    setContent(newContent);
  };

  const publishContent = async (newContent: SiteContentConfig): Promise<boolean> => {
    setContent(newContent);
    return await SiteContentService.publishLiveContent(newContent);
  };

  const resetToDefaults = () => {
    const defaults = SiteContentService.resetToDefaults();
    setContent(defaults);
    return defaults;
  };

  return (
    <SiteContentContext.Provider value={{
      content,
      isLoading,
      updateContent,
      publishContent,
      resetToDefaults,
      reloadContent
    }}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => useContext(SiteContentContext);
