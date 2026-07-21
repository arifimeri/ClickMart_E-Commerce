import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // Importojmë ikonat

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State për syrin

  // State për kontrollin e gabimeve në kohë reale
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    number: false,
    specialChar: false,
    noSlash: true,
  });

  const navigate = useNavigate();

  // Ndryshimi i fjalëkalimit në kohë reale
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Kontrollojmë kriteret vetëm nëse jemi në Sign Up
    setPasswordErrors({
      length: value.length >= 6,
      number: /\d/.test(value),
      specialChar: /[!@?_.\-*#$]/.test(value),
      noSlash: !value.includes('/'),
    });
  };

  // Funksioni për të pastruar gabimet dhe fjalëkalimin kur ndërrojmë faqen
  const toggleState = (state) => {
    setCurrentState(state);
    setPassword('');
    setShowPassword(false);
    setPasswordErrors({
      length: false,
      number: false,
      specialChar: false,
      noSlash: true,
    });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (currentState === 'Sign Up') {
        // Kontrollojmë nëse të gjitha kriteret janë true për regjistrim
        const isPasswordValid = 
          passwordErrors.length && 
          passwordErrors.number && 
          passwordErrors.specialChar && 
          passwordErrors.noSlash;

        if (!isPasswordValid) {
          toast.error("Ju lutem plotësoni saktë të gjitha kriteret e fjalëkalimit!");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              display_name: name,
            },
          },
        });

        if (error) throw error;

        toast.success("Llogaria u krijua me sukses");
        toggleState('Login');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password
        });
        if (error) throw error;

        toast.success("Mireseerdhet!");
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
      console.log("Gabim ne authentikim:", error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800"/>
        </div>

        {currentState === 'Login' ? '' : (
          <input 
            type="text"
            className="w-full px-3 py-2 border border-gray-800" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Inputi i Fjalëkalimit me Syrin */}
        <div className="relative w-full">
          <input 
            type={showPassword ? "text" : "password"} 
            className="w-full px-3 py-2 border border-gray-800 pr-10" 
            placeholder="Password" 
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black cursor-pointer"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>

        {/* Warning-et në kohë reale SHFAQEN VETËM NË SIGN UP */}
        {currentState === 'Sign Up' && password.length > 0 && (
          <div className="w-full text-xs p-3 bg-gray-50 rounded border border-gray-200 space-y-1">
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
        
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer">Forgot your password?</p>
          {
            currentState === 'Login'
            ? <p onClick={() => toggleState('Sign Up')} className="cursor-pointer">Create account</p>
            : <p onClick={() => toggleState('Login')} className="cursor-pointer">Login here</p>
          }
        </div>
        
        <button className="bg-black text-white font-light px-8 py-2 mt-4">
          {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>
    </form>
  )
};

export default Login;