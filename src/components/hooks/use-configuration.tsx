import type { Configuration } from '@/types/configuration';
import { useState, useEffect } from 'react';

const useConfiguration = () => {
  const [configurations, setConfigurations] = useState<Configuration[]>([]);

  useEffect(() => {
    //@ts-ignore
    if (typeof chrome !== 'undefined') {
      //@ts-ignore
      chrome.storage.local.get('configurations').then((result: { configurations: Configuration[] }) => {
        const savedConfigs = (result?.configurations || []);

        if (savedConfigs?.length) {
          setConfigurations(savedConfigs);
        }
      });
      //@ts-ignore
    } else if (typeof browser !== 'undefined') {
      //@ts-ignore
      browser.storage.local.get('configurations').then((result: { configurations: Configuration[] }) => {
        const savedConfigs = (result?.configurations || []);

        if (savedConfigs?.length) {
          setConfigurations(savedConfigs);
        }
      });
    } else {
      console.error('No storage API available');
    }
  }, []);

  const saveConfigs = (configs: Configuration[]) => {
    //@ts-ignore
    if (typeof chrome !== 'undefined') {
      //@ts-ignore
      chrome.storage.local.set({ configurations: configs });
      //@ts-ignore
    } else if (typeof browser !== 'undefined') {
      //@ts-ignore
      browser.storage.local.set({ configurations: configs });
    } else {
      console.error('No storage API available');
    }
  };

  const deleteConfig = (id: string) => {
    const index = configurations.findIndex((config) => config.id === id);
    configurations.splice(index, 1);
    const updatedConfigs = [...configurations];
    setConfigurations(updatedConfigs);
    saveConfigs(updatedConfigs);
  };

  const addConfig = (newConfig: Configuration) => {
    newConfig.id = crypto.randomUUID();
    newConfig.createdAt = Date.now();
    const updatedConfigs = [...configurations, newConfig];
    setConfigurations(updatedConfigs);
    saveConfigs(updatedConfigs);
  };

  const updateConfig = (id: string, configuration: Configuration) => {
    const index = configurations.findIndex((config) => config.id === id);
    configurations[index] = { ...configuration, id, createdAt: configurations[index].createdAt };
    const updatedConfigs = [...configurations];
    setConfigurations(updatedConfigs);
    saveConfigs(updatedConfigs);
  }

  return { configurations, deleteConfig, addConfig, updateConfig };
};

export default useConfiguration;