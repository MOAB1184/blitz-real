'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Switch } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  bio?: string | null;
  website?: string | null;
  socialLinks?: any;
  role: string;
}

interface NotificationPreferences {
  emailNotifications: {
    newMessages: boolean;
    applicationUpdates: boolean;
    listingMatches: boolean;
    paymentUpdates: boolean;
    weeklyDigest: boolean;
  };
  pushNotifications: {
    newMessages: boolean;
    applicationUpdates: boolean;
    listingMatches: boolean;
    paymentUpdates: boolean;
  };
  smsNotifications: {
    paymentUpdates: boolean;
    urgentUpdates: boolean;
  };
}

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  
  // Profile state
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [website, setWebsite] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileUpdating, setProfileUpdating] = useState(false);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);
  
  // Notification preferences state
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationsError, setNotificationsError] = useState<string | null>(null);
  const [notificationsSuccess, setNotificationsSuccess] = useState(false);
  const [notificationsUpdating, setNotificationsUpdating] = useState(false);
  
  // Account deletion state
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await fetch('/api/profile');
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        
        const userData = await response.json();
        setUser(userData);
        setName(userData.name || '');
        setBio(userData.bio || '');
        setWebsite(userData.website || '');
        setProfileError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setProfileError('Failed to load profile information. Please try again.');
      } finally {
        setProfileLoading(false);
      }
    };

    const fetchNotificationPreferences = async () => {
      try {
        setNotificationsLoading(true);
        const response = await fetch('/api/notifications');
        
        if (!response.ok) {
          throw new Error('Failed to fetch notification preferences');
        }
        
        const preferencesData = await response.json();
        setNotificationPreferences(preferencesData);
        setNotificationsError(null);
      } catch (err) {
        console.error('Error fetching notification preferences:', err);
        setNotificationsError('Failed to load notification preferences. Please try again.');
      } finally {
        setNotificationsLoading(false);
      }
    };

    if (session?.user) {
      fetchProfile();
      fetchNotificationPreferences();
    }
  }, [session]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setProfileUpdating(true);
      setProfileSuccess(false);
      setProfileError(null);
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          bio,
          website,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      const updatedUser = await response.json();
      setUser(updatedUser);
      
      // Update session with new name
      if (session?.user) {
        await updateSession({
          ...session,
          user: {
            ...session.user,
            name: updatedUser.name,
          },
        });
      }
      
      setProfileSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setProfileError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setProfileUpdating(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    try {
      setPasswordUpdating(true);
      setPasswordSuccess(false);
      setPasswordError(null);
      
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setPasswordSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Error changing password:', err);
      setPasswordError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setPasswordUpdating(false);
    }
  };

  // Handle notification preferences update
  const handleNotificationUpdate = async () => {
    if (!notificationPreferences) return;
    
    try {
      setNotificationsUpdating(true);
      setNotificationsSuccess(false);
      setNotificationsError(null);
      
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationPreferences),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update notification preferences');
      }
      
      setNotificationsSuccess(true);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setNotificationsSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Error updating notification preferences:', err);
      setNotificationsError(err.message || 'Failed to update notification preferences. Please try again.');
    } finally {
      setNotificationsUpdating(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!deleteAccountPassword) {
      setDeleteError('Password is required to delete your account');
      return;
    }
    
    try {
      setDeleteLoading(true);
      setDeleteError(null);
      
      const response = await fetch('/api/profile', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: deleteAccountPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }
      
      // Redirect to login page
      router.push('/login?deleted=true');
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setDeleteError(err.message || 'Failed to delete account. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Toggle notification preference
  const toggleNotificationPreference = (
    category: keyof NotificationPreferences,
    setting: string,
    value: boolean
  ) => {
    if (!notificationPreferences) return;
    
    setNotificationPreferences({
      ...notificationPreferences,
      [category]: {
        ...notificationPreferences[category],
        [setting]: value,
      },
    });
  };

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto py-10">
        <p className="text-center">Please sign in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      {/* Account Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Info</h2>
        
        {profileLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ) : profileError ? (
          <div className="text-red-500 mb-4">{profileError}</div>
        ) : (
          <form onSubmit={handleProfileUpdate}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-100">
                  {user?.role === 'SPONSOR' ? 'Sponsor' : 'Creator'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <div className="flex items-center">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'Profile'}
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500 mr-4">
                      {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
                    disabled
                  >
                    Change Image (Coming Soon)
                  </button>
                </div>
              </div>
              
              {profileSuccess && (
                <div className="text-green-500">Profile updated successfully!</div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={profileUpdating}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {profileUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
      
      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Change Password</h2>
        
        <form onSubmit={handlePasswordChange}>
          <div className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {passwordError && (
              <div className="text-red-500">{passwordError}</div>
            )}
            
            {passwordSuccess && (
              <div className="text-green-500">Password changed successfully!</div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={passwordUpdating || !currentPassword || !newPassword || !confirmPassword}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {passwordUpdating ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Notification Preferences */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
        
        {notificationsLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ) : notificationsError ? (
          <div className="text-red-500 mb-4">{notificationsError}</div>
        ) : notificationPreferences ? (
          <div className="space-y-6">
            {/* Email Notifications */}
            <div>
              <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
              <div className="space-y-2">
                {Object.entries(notificationPreferences.emailNotifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{formatNotificationKey(key)}</span>
                    <Switch
                      checked={value}
                      onChange={(checked) => toggleNotificationPreference('emailNotifications', key, checked)}
                      className={`${
                        value ? 'bg-blue-500' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          value ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Push Notifications */}
            <div>
              <h3 className="text-lg font-medium mb-2">Push Notifications</h3>
              <div className="space-y-2">
                {Object.entries(notificationPreferences.pushNotifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{formatNotificationKey(key)}</span>
                    <Switch
                      checked={value}
                      onChange={(checked) => toggleNotificationPreference('pushNotifications', key, checked)}
                      className={`${
                        value ? 'bg-blue-500' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          value ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                ))}
              </div>
            </div>
            
            {/* SMS Notifications */}
            <div>
              <h3 className="text-lg font-medium mb-2">SMS Notifications</h3>
              <div className="space-y-2">
                {Object.entries(notificationPreferences.smsNotifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{formatNotificationKey(key)}</span>
                    <Switch
                      checked={value}
                      onChange={(checked) => toggleNotificationPreference('smsNotifications', key, checked)}
                      className={`${
                        value ? 'bg-blue-500' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          value ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                      />
                    </Switch>
                  </div>
                ))}
              </div>
            </div>
            
            {notificationsSuccess && (
              <div className="text-green-500">Notification preferences updated successfully!</div>
            )}
            
            <div>
              <button
                onClick={handleNotificationUpdate}
                disabled={notificationsUpdating}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {notificationsUpdating ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        ) : null}
      </div>
      
      {/* Delete Account */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Account</h2>
        
        {!showDeleteConfirmation ? (
          <div>
            <p className="text-gray-700 mb-4">
              Deleting your account is permanent and cannot be undone. All your data will be permanently removed.
            </p>
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="deletePassword" className="block text-sm font-medium text-gray-700 mb-1">
                Enter your password to confirm
              </label>
              <input
                type="password"
                id="deletePassword"
                value={deleteAccountPassword}
                onChange={(e) => setDeleteAccountPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            
            {deleteError && (
              <div className="text-red-500 mb-4">{deleteError}</div>
            )}
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setDeleteAccountPassword('');
                  setDeleteError(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading || !deleteAccountPassword}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format notification keys
function formatNotificationKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1') // Insert a space before all capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
}

