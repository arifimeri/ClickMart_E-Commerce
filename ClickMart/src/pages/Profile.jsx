import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import { Eye, EyeOff } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(ShopContext);
  
  // Shtetet për Emrin
  const [newName, setNewName] = useState('');
  const [loadingName, setLoadingName] = useState(false);

  // Shtetet për Fjalëkalimin
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Shtetet për shfaqjen e fjalëkalimeve (Show/Hide)
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Shteti për gabimet e fjalëkalimit në kohë reale
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    number: false,
    specialChar: false,
    noSlash: true,
  });

  // Vendos emrin aktual kur ngarkohet përdoruesi
  useEffect(() => {
    if (user?.user_metadata?.display_name) {
      setNewName(user.user_metadata.display_name);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="text-center mt-20 text-gray-600">
        <p className="text-xl font-light">Ju lutem kyçuni për të parë profilin tuaj.</p>
      </div>
    );
  }

  // Kontrolli i fjalëkalimit në kohë reale
  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    setPasswordErrors({
      length: value.length >= 6,
      number: /\d/.test(value),
      specialChar: /[!@?_.\-*#$]/.test(value),
      noSlash: !value.includes('/'),
    });
  };

  // Funksioni për dërgimin e emailit të sigurisë
  const sendSecurityEmail = (changeType) => {
    const templateParams = {
      to_email: user.email,
      user_name: user.user_metadata?.display_name || 'User',
      change_info: changeType === 'name' 
        ? 'your profile name has been updated' 
        : 'your account password has been changed'
    };

    emailjs.send(
      'service_1jicxga', 
      'template_d45xu5b', 
      templateParams, 
      'D2FPVkT623MRHn8uB'
    )
    .then(() => console.log('Email i sigurisë u dërgua me sukses.'))
    .catch((err) => console.error('Gabim gjatë dërgimit të emailit:', err));
  };

  // Përditësimi i Emrit
  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast.error("Emri nuk mund të jetë i zbrazët!");
      return;
    }

    setLoadingName(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: newName }
      });

      if (error) throw error;
      
      toast.success("Emri u përditësua me sukses!");
      sendSecurityEmail('name');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingName(false);
    }
  };

  // Përditësimi i Fjalëkalimit
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // Kontrollojmë validimin e fjalëkalimit të ri nga shteti ynë
    const isPasswordValid = 
      passwordErrors.length && 
      passwordErrors.number && 
      passwordErrors.specialChar && 
      passwordErrors.noSlash;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Ju lutem plotësoni të gjitha fushat e fjalëkalimit!");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Ju lutem plotësoni saktë të gjitha kriteret e fjalëkalimit të ri!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Fjalëkalimet e reja nuk përputhen!");
      return;
    }

    setLoadingPassword(true);
    try {
      // Verifikojmë fjalëkalimin e vjetër
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: oldPassword,
      });

      if (signInError) throw new Error("Fjalëkalimi aktual është i pasaktë!");

      // Ruajmë fjalëkalimin e ri
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success("Fjalëkalimi u ndryshua me sukses!");
      sendSecurityEmail('password');

      // Pastrojmë fushat dhe shtetet e gabimeve
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordErrors({
        length: false,
        number: false,
        specialChar: false,
        noSlash: true,
      });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-md m-auto mt-14 p-8 border border-gray-300 rounded-lg shadow-sm text-gray-800 bg-white">
      <h2 className="text-3xl font-medium prata-regular text-center mb-8 border-b pb-4">
        My Profile
      </h2>
      
      <div className="space-y-6">
        {/* Email fusha */}
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Email Address
          </label>
          <p className="text-lg mt-1 text-gray-600 bg-gray-50 p-2 rounded border border-gray-100">
            {user.email}
          </p>
        </div>

        {/* Forma e Emrit */}
        <form onSubmit={handleUpdateName} className="pt-4 border-t border-gray-100">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Change Name
          </label>
          <div className="flex gap-2">
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
              placeholder="Enter new name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <button 
              type="submit" 
              disabled={loadingName}
              className="bg-black text-white text-xs px-4 py-2 rounded hover:bg-gray-800 transition disabled:bg-gray-400"
            >
              {loadingName ? 'Saving...' : 'Update'}
            </button>
          </div>
        </form>

        {/* Forma e Fjalëkalimit */}
        <form onSubmit={handleUpdatePassword} className="pt-4 border-t border-gray-100 space-y-3">
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Change Password
          </label>
          
          {/* Current Password */}
          <div className="relative">
            <input 
              type={showOldPassword ? "text" : "password"} 
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
              placeholder="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
            >
              {showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* New Password */}
          <div className="relative">
            <input 
              type={showNewPassword ? "text" : "password"} 
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
              placeholder="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
            >
              {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {/* Warning-et në kohë reale për fjalëkalimin e ri */}
          {newPassword.length > 0 && (
            <div className="text-xs p-3 bg-gray-50 rounded border border-gray-200 space-y-1">
              <p className={passwordErrors.length ? "text-green-600 font-medium" : "text-red-500"}>
                {passwordErrors.length ? "✓" : "✗"} Të paktën 6 karaktere
              </p>
              <p className={passwordErrors.number ? "text-green-600 font-medium" : "text-red-500"}>
                {passwordErrors.number ? "✓" : "✗"} Të paktën një numër
              </p>
              <p className={passwordErrors.specialChar ? "text-green-600 font-medium" : "text-red-500"}>
                {passwordErrors.specialChar ? "✓" : "✗"} Karakter special (!, ?, @, etj.)
              </p>
              <p className={passwordErrors.noSlash ? "text-green-600 font-medium" : "text-red-500"}>
                {passwordErrors.noSlash ? "✓ Nuk përmban /" : "✗ Nuk lejohet karakteri /"}
              </p>
            </div>
          )}

          {/* Re-type New Password */}
          <div className="relative">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
              placeholder="Re-type New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={loadingPassword}
            className="w-full bg-black text-white text-sm py-2 rounded hover:bg-gray-800 transition disabled:bg-gray-400 font-light"
          >
            {loadingPassword ? 'Verifying & Saving...' : 'Change Password'}
          </button>
        </form>

        {/* Statusi */}
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account Status</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;