import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent } from '@app/components/ui/card';
import { Button } from '@app/components/ui/button';
import { Switch } from '@app/components/ui/switch';
import { Settings as SettingsIcon, Loader2, Check, AlertCircle, Sun, Moon, Laptop, Palette, Bell, Shield } from 'lucide-react';
import { AppDispatch } from '@app/store';
import { fetchUserPreferencesActionAsync, updateUserPreferencesActionAsync } from '@app/store/actions/user-preferences/user-preferences-async-actions';
import { userPreferencesSelector, userPreferencesLoadingSelector } from '@app/store/selectors/user-preferences-selectors';
import { userSelector } from '@app/store/selectors/user-selectors';
import { useTheme } from '@app/components/ui/theme-provider';

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(userSelector);
  const userPreferences = useSelector(userPreferencesSelector);
  const isLoading = useSelector(userPreferencesLoadingSelector);
  const { setTheme } = useTheme();

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [originalTheme, setOriginalTheme] = useState<string>('System');
  const [previewTheme, setPreviewTheme] = useState<string>('System');

  const [formData, setFormData] = useState({
    isTwoFactorEnabled: false,
    eventRemindersEnabled: true,
    messageNotificationsEnabled: true,
    associationUpdatesEnabled: true,
    marketingEmailsEnabled: false,
    theme: 'System',
  });

  useEffect(() => {
    if (user?.id && !userPreferences) {
      dispatch(fetchUserPreferencesActionAsync(user.id));
    }
  }, [dispatch, user?.id, userPreferences]);

  useEffect(() => {
    if (userPreferences) {
      const savedTheme = userPreferences.theme || 'System';
      setFormData({
        isTwoFactorEnabled: userPreferences.isTwoFactorEnabled ?? false,
        eventRemindersEnabled: userPreferences.eventRemindersEnabled ?? true,
        messageNotificationsEnabled: userPreferences.messageNotificationsEnabled ?? true,
        associationUpdatesEnabled: userPreferences.associationUpdatesEnabled ?? true,
        marketingEmailsEnabled: userPreferences.marketingEmailsEnabled ?? false,
        theme: savedTheme,
      });
      setOriginalTheme(savedTheme);
      setPreviewTheme(savedTheme);
    }
  }, [userPreferences]);

  // Handle page reload/navigation - revert to original theme if changes not saved
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (previewTheme !== originalTheme) {
        const themeMap: Record<string, 'light' | 'dark' | 'system'> = {
          Light: 'light',
          Dark: 'dark',
          System: 'system',
        };
        setTheme(themeMap[originalTheme] || 'system');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [previewTheme, originalTheme, setTheme]);

  // Handle component unmount (navigation away) - revert unsaved theme changes
  useEffect(() => {
    return () => {
      if (previewTheme !== originalTheme) {
        console.log('Settings: Component unmounting, reverting theme from', previewTheme, 'to', originalTheme);
        const themeMap: Record<string, 'light' | 'dark' | 'system'> = {
          Light: 'light',
          Dark: 'dark',
          System: 'system',
        };
        setTheme(themeMap[originalTheme] || 'system');
      }
    };
  }, [previewTheme, originalTheme, setTheme]);

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThemePreview = (newTheme: string) => {
    console.log('Settings: Theme preview changed to:', newTheme, '(Original:', originalTheme + ')');

    setPreviewTheme(newTheme);
    handleInputChange('theme', newTheme);

    // Apply theme immediately for preview
    const themeMap: Record<string, 'light' | 'dark' | 'system'> = {
      Light: 'light',
      Dark: 'dark',
      System: 'system',
    };
    setTheme(themeMap[newTheme] || 'system');
  };

  const handleSaveSettings = async () => {
    if (!user?.id) return;

    setSaveStatus('saving');

    try {
      await dispatch(
        updateUserPreferencesActionAsync({
          userId: user.id,
          preferences: formData,
        }),
      ).unwrap();

      // Apply the theme ONLY after successful save
      const themeMap: Record<string, 'light' | 'dark' | 'system'> = {
        Light: 'light',
        Dark: 'dark',
        System: 'system',
      };
      setTheme(themeMap[formData.theme] || 'system');

      // Update original theme after successful save
      setOriginalTheme(formData.theme);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleResetToOriginal = () => {
    const themeMap: Record<string, 'light' | 'dark' | 'system'> = {
      Light: 'light',
      Dark: 'dark',
      System: 'system',
    };

    // Revert to original saved theme
    setPreviewTheme(originalTheme);
    setFormData(prev => ({ ...prev, theme: originalTheme }));
    setTheme(themeMap[originalTheme] || 'system');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-border border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading settings...</p>
        </div>
      </div>
    );
  }

  const hasUnsavedChanges =
    previewTheme !== originalTheme ||
    formData.isTwoFactorEnabled !== (userPreferences?.isTwoFactorEnabled ?? false) ||
    formData.eventRemindersEnabled !== (userPreferences?.eventRemindersEnabled ?? true) ||
    formData.messageNotificationsEnabled !== (userPreferences?.messageNotificationsEnabled ?? true) ||
    formData.associationUpdatesEnabled !== (userPreferences?.associationUpdatesEnabled ?? true) ||
    formData.marketingEmailsEnabled !== (userPreferences?.marketingEmailsEnabled ?? false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-3 md:p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <SettingsIcon className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Settings</h1>
              <p className="text-muted-foreground text-xs">Manage your preferences</p>
            </div>
          </div>
          <div className="flex gap-2">
            {hasUnsavedChanges && (
              <Button variant="outline" onClick={handleResetToOriginal} className="min-w-[80px] h-8 text-xs">
                Reset
              </Button>
            )}
            <Button onClick={handleSaveSettings} disabled={saveStatus === 'saving' || !hasUnsavedChanges} className="min-w-[80px] h-8 text-xs">
              {saveStatus === 'saving' && <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />}
              {saveStatus === 'saved' && <Check className="w-3 h-3 mr-1.5" />}
              {saveStatus === 'error' && <AlertCircle className="w-3 h-3 mr-1.5" />}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save'}
            </Button>
          </div>
        </div>

        {/* Unified Settings Card */}
        <Card className="border border-border">
          <CardContent className="p-4 space-y-6">
            {/* Appearance Preferences */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Palette className="w-4 h-4 text-primary" />
                <h3 className="text-base font-medium text-foreground">Appearance Preferences</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    Theme {previewTheme !== originalTheme && <span className="text-xs text-amber-600">(Preview - not saved)</span>}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">Choose your preferred theme. Changes are previewed instantly but not saved until you click Save.</p>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleThemePreview('Light')}
                      className={`p-2 border-2 rounded-lg flex flex-col items-center gap-1 text-xs transition-colors ${
                        previewTheme === 'Light' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      <span>Light</span>
                    </button>
                    <button
                      onClick={() => handleThemePreview('Dark')}
                      className={`p-2 border-2 rounded-lg flex flex-col items-center gap-1 text-xs transition-colors ${
                        previewTheme === 'Dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      <span>Dark</span>
                    </button>
                    <button
                      onClick={() => handleThemePreview('System')}
                      className={`p-2 border-2 rounded-lg flex flex-col items-center gap-1 text-xs transition-colors ${
                        previewTheme === 'System' ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80'
                      }`}
                    >
                      <Laptop className="w-4 h-4" />
                      <span>System</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-primary" />
                <h3 className="text-base font-medium text-foreground">Notification Preferences</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Event Reminders</h4>
                    <p className="text-sm text-muted-foreground mt-1">Get reminded about upcoming events</p>
                  </div>
                  <Switch checked={formData.eventRemindersEnabled} onCheckedChange={checked => handleInputChange('eventRemindersEnabled', checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Message Notifications</h4>
                    <p className="text-sm text-muted-foreground mt-1">Receive notifications for new messages</p>
                  </div>
                  <Switch checked={formData.messageNotificationsEnabled} onCheckedChange={checked => handleInputChange('messageNotificationsEnabled', checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Association Updates</h4>
                    <p className="text-sm text-muted-foreground mt-1">Receive updates from followed associations</p>
                  </div>
                  <Switch checked={formData.associationUpdatesEnabled} onCheckedChange={checked => handleInputChange('associationUpdatesEnabled', checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Marketing Emails</h4>
                    <p className="text-sm text-muted-foreground mt-1">Receive promotional emails and newsletters</p>
                  </div>
                  <Switch checked={formData.marketingEmailsEnabled} onCheckedChange={checked => handleInputChange('marketingEmailsEnabled', checked)} />
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium text-foreground">Security Settings</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Two-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <Switch checked={formData.isTwoFactorEnabled} onCheckedChange={checked => handleInputChange('isTwoFactorEnabled', checked)} />
                </div>
              </div>
            </div>

            {hasUnsavedChanges && (
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">You have unsaved changes. Click "Save" to apply them or "Reset" to revert to your previous settings.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
