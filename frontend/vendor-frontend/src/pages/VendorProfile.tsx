import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { User, Store, Mail, Phone, MapPin, Clock, Camera, Save, Loader2, ArrowRight, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function VendorProfile() {
  const { vendor, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityType, setSecurityType] = useState<'password' | '2fa'>('password');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    canteenName: vendor?.canteenName || '',
    ownerName: vendor?.ownerName || '',
    email: vendor?.email || '',
    phone: vendor?.phone || '',
    address: vendor?.address || '',
    openingTime: vendor?.openingTime || '',
    closingTime: vendor?.closingTime || '',
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfile({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      updateProfile(formData);
      setIsLoading(false);
      setIsEditing(false);
    }, 1000);
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      alert('Security settings updated successfully!');
      setIsLoading(false);
      setShowSecurityModal(false);
      setSecurityData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-line dark:border-slate-700 overflow-hidden shadow-sm transition-colors">
<div className="flex items-center gap-6 px-8 pt-8">
            <div className="relative group">
{vendor?.logo && !vendor.logo.includes("picsum.photos") ? (
  <img
    src={vendor.logo}
    alt="Canteen Logo"
    className="w-32 h-32 rounded-3xl border-4 border-white dark:border-slate-800 object-cover shadow-lg"
  />
) : (
  <div className="w-32 h-32 rounded-3xl border-4 border-white dark:border-slate-800 bg-emerald-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
    {(vendor?.canteenName || "V")[0].toUpperCase()}
  </div>
)}

  <button
    onClick={() => fileInputRef.current?.click()}
    className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
  >
    <Camera className="w-6 h-6" />
  </button>

  <input
    type="file"
    ref={fileInputRef}
    onChange={handleImageUpload}
    className="hidden"
    accept="image/*"
  />
</div>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{vendor?.canteenName}</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium">{vendor?.ownerName}</p>
            </div>
          </div>

        <div className="pt-20 p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Canteen Information</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                isEditing
                  ? "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                  : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
              }`}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Canteen Name</label>
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.canteenName}
                  onChange={(e) => setFormData({ ...formData, canteenName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-70 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Owner Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-70 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-70 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="tel"
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-70 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <textarea
                  disabled={!isEditing}
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-70 resize-none dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Opening Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.openingTime}
                  onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-70 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">Closing Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.closingTime}
                  onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-slate-900 transition-all disabled:opacity-70 dark:text-white"
                />
              </div>
            </div>

            {isEditing && (
              <div className="md:col-span-2 pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100 disabled:opacity-70"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-line dark:border-slate-700 p-8 shadow-sm transition-colors">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h3>
        <div className="space-y-4">
          <button 
            onClick={() => { setSecurityType('password'); setShowSecurityModal(true); }}
            className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all group"
          >
            <div className="text-left">
              <p className="font-bold text-gray-900 dark:text-white">Change Password</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </button>
          <button 
            onClick={() => { setSecurityType('2fa'); setShowSecurityModal(true); }}
            className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all group"
          >
            <div className="text-left">
              <p className="font-bold text-gray-900 dark:text-white">Two-Factor Authentication</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* Security Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-line dark:border-slate-700 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
                  {securityType === 'password' ? <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {securityType === 'password' ? 'Change Password' : 'Two-Factor Auth'}
                </h3>
              </div>

              <form onSubmit={handleSecuritySubmit} className="p-8 space-y-6">
                {securityType === 'password' ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Password</label>
                      <input
                        type="password"
                        required
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">New Password</label>
                      <input
                        type="password"
                        required
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900/50 border border-line dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all dark:text-white"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">Enable two-factor authentication to add an extra layer of security to your account.</p>
                    <div className="p-4 bg-gray-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">Authenticator App</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Use an app like Google Authenticator or Authy</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSecurityModal(false)}
                    className="flex-1 px-6 py-3 bg-white dark:bg-slate-800 border border-line dark:border-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-emerald-500 text-white font-bold rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100 disabled:opacity-70 flex items-center justify-center"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
