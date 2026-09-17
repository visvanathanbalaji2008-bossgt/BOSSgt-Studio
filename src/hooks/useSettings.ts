import { useState, useEffect, useCallback } from 'react';

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: "on" | "off";
  minimap: boolean;
  lineNumbers: "on" | "off";
  autoClosingBrackets: "always" | "languageDefined" | "beforeWhitespace" | "never";
  theme: string;
}

export interface AppearanceSettings {
  uiTheme: "dark" | "light";
}

export interface Extension {
  id: string;
  name: string;
  description: string;
  version: string;
  installed: boolean;
  enabled: boolean;
}

export interface Settings {
  editor: EditorSettings;
  appearance: AppearanceSettings;
  extensions: Extension[];
}

const defaultSettings: Settings = {
  editor: {
    fontSize: 14,
    tabSize: 2,
    wordWrap: "on",
    minimap: true,
    lineNumbers: "on",
    autoClosingBrackets: "languageDefined",
    theme: "vs-dark"
  },
  appearance: {
    uiTheme: "dark"
  },
  extensions: [
    { id: "ext-python", name: "Python Language Support", description: "IntelliSense (Pylance), Linting, Debugging (multi-target), code formatting, refactoring, unit tests, and more.", version: "1.0.0", installed: false, enabled: false },
    { id: "ext-prettier", name: "Prettier - Code formatter", description: "Code formatter using prettier.", version: "2.3.0", installed: false, enabled: false },
    { id: "ext-eslint", name: "ESLint", description: "Integrates ESLint JavaScript into VS Code.", version: "2.4.0", installed: false, enabled: false },
    { id: "ext-cpp", name: "C/C++", description: "C/C++ IntelliSense, debugging, and code browsing.", version: "1.15.4", installed: false, enabled: false }
  ]
};

export function useSettings() {
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem("bossgt_settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettingsState({
          ...defaultSettings,
          ...parsed,
          editor: { ...defaultSettings.editor, ...parsed.editor },
          appearance: { ...defaultSettings.appearance, ...parsed.appearance },
          // Merge extensions to keep new default extensions if added later
          extensions: defaultSettings.extensions.map(defExt => {
            const savedExt = parsed.extensions?.find((e: Extension) => e.id === defExt.id);
            return savedExt ? { ...defExt, ...savedExt } : defExt;
          })
        });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }

    const handleSettingsChange = (e: Event) => {
      const customEvent = e as CustomEvent<Settings>;
      if (customEvent.detail) {
        setSettingsState(customEvent.detail);
      }
    };
    
    const toggleMinimap = () => {
      setSettingsState(prev => {
        const updated = { ...prev, editor: { ...prev.editor, minimap: !prev.editor.minimap } };
        localStorage.setItem("bossgt_settings", JSON.stringify(updated));
        return updated;
      });
    };

    const toggleWordWrap = () => {
      setSettingsState(prev => {
        const updated = { ...prev, editor: { ...prev.editor, wordWrap: prev.editor.wordWrap === 'on' ? 'off' : 'on' as 'on'|'off' } };
        localStorage.setItem("bossgt_settings", JSON.stringify(updated));
        return updated;
      });
    };

    window.addEventListener('bossgt_settings_changed', handleSettingsChange);
    window.addEventListener('view:toggle-minimap', toggleMinimap);
    window.addEventListener('view:toggle-word-wrap', toggleWordWrap);
    
    return () => {
      window.removeEventListener('bossgt_settings_changed', handleSettingsChange);
      window.removeEventListener('view:toggle-minimap', toggleMinimap);
      window.removeEventListener('view:toggle-word-wrap', toggleWordWrap);
    };
  }, []);

  const persistAndDispatch = (updated: Settings) => {
    localStorage.setItem("bossgt_settings", JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('bossgt_settings_changed', { detail: updated }));
  };

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettingsState(prev => {
      const updated = { ...prev, ...newSettings };
      persistAndDispatch(updated);
      return updated;
    });
  }, []);

  const updateEditorSettings = useCallback((newEditorSettings: Partial<EditorSettings>) => {
    setSettingsState(prev => {
      const updated = { ...prev, editor: { ...prev.editor, ...newEditorSettings } };
      persistAndDispatch(updated);
      return updated;
    });
  }, []);

  const updateAppearanceSettings = useCallback((newAppearanceSettings: Partial<AppearanceSettings>) => {
    setSettingsState(prev => {
      const updated = { ...prev, appearance: { ...prev.appearance, ...newAppearanceSettings } };
      persistAndDispatch(updated);
      return updated;
    });
  }, []);

  const toggleExtension = useCallback((id: string, field: 'installed' | 'enabled', value: boolean) => {
    setSettingsState(prev => {
      const updated = {
        ...prev,
        extensions: prev.extensions.map(ext => 
          ext.id === id ? { ...ext, [field]: value } : ext
        )
      };
      persistAndDispatch(updated);
      return updated;
    });
  }, []);

  return {
    settings,
    updateSettings,
    updateEditorSettings,
    updateAppearanceSettings,
    toggleExtension
  };
}
