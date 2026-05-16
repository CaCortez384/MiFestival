import { useState, useEffect } from 'react';
import useSEO from "../hooks/useSEO";
import { trackEvent } from "../utils/analytics";
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '../firebase';
import mflogo from "../assets/mflogo20.png";
import { LockClosedIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const Restablecer = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useSEO({
        title: 'Restablecer Contraseña | MiFestival',
        description: 'Restablece tu contraseña de MiFestival para recuperar el acceso a tu cuenta.',
        noindex: true,
    });

    // Firebase envía el código en el parámetro 'oobCode'
    const oobCode = searchParams.get('oobCode');

    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isCodeValid, setIsCodeValid] = useState(true);

    // Validar el código al cargar la página
    useEffect(() => {
        const checkCode = async () => {
            if (!oobCode) {
                setIsCodeValid(false);
                return;
            }
            try {
                // Verificamos si el código es válido antes de mostrar el formulario
                await verifyPasswordResetCode(auth, oobCode);
            } catch (err) {
                console.error(err);
                setIsCodeValid(false);
            }
        };
        checkCode();
    }, [oobCode]);

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        setLoading(true);
        setError('');

        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            trackEvent('password_reset_completed');
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000); // Redirigir tras 3 segundos
        } catch (err) {
            console.error(err);
            setError("El enlace ha expirado o ya fue usado. Solicita uno nuevo.");
        } finally {
            setLoading(false);
        }
    };

    // --- UI: ESTILO NEOBRUTALISTA ---
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-brutal-base text-[#050510] font-inter relative overflow-hidden p-4 border-x-4 border-black max-w-[1600px] mx-auto">

            {/* Fondo Textura */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

            <div className="bg-[#00E5FF] border-4 border-black p-8 sm:p-10 max-w-md w-full relative shadow-[8px_8px_0_#000] transform -rotate-1">

                <div className="text-center mb-8 bg-white border-4 border-black p-4 shadow-[8px_8px_0_#000] transform rotate-2">
                    <img src={mflogo} alt="Logo" className="w-12 h-12 mx-auto mb-2 border-2 border-black" />
                    <h1 className="text-2xl brutal-title">NUEVA CONTRASEÑA</h1>
                </div>

                {/* CASO 1: CÓDIGO INVÁLIDO */}
                {!isCodeValid ? (
                    <div className="text-center bg-white border-4 border-black p-6 shadow-[4px_4px_0_#000] transform rotate-1">
                        <div className="text-red-500 mb-6">
                            <XCircleIcon className="w-16 h-16 mx-auto mb-2" />
                            <p className="font-bold uppercase tracking-widest text-black">EL ENLACE ES INVÁLIDO O HA EXPIRADO.</p>
                        </div>
                        <Link to="/login" className="inline-block bg-yellow-400 brutal-btn py-3 px-6 text-xl text-black">VOLVER AL LOGIN</Link>
                    </div>
                ) : success ? (
                    /* CASO 2: ÉXITO */
                    <div className="text-center animate-fade-in-up bg-white border-4 border-black p-6 shadow-[4px_4px_0_#000] transform -rotate-1">
                        <div className="text-[#00FF66] mb-6">
                            <CheckCircleIcon className="w-20 h-20 mx-auto mb-4 border-4 border-black rounded-full bg-white p-2" />
                            <h3 className="text-2xl brutal-title mb-2 bg-yellow-400 inline-block px-2 border-2 border-black rotate-2">¡ACTUALIZADA!</h3>
                            <p className="text-sm font-black uppercase text-black mt-4">Redirigiendo al login...</p>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-[#FF90E8] brutal-btn py-4 text-xl mt-4 text-black"
                        >
                            IR AL LOGIN AHORA
                        </button>
                    </div>
                ) : (
                    /* CASO 3: FORMULARIO DE CAMBIO */
                    <form onSubmit={handleReset} className="space-y-6">
                        <div>
                            <label className="block text-sm font-black text-black uppercase tracking-widest mb-2 bg-white inline-block px-1 border-2 border-black rotate-1">NUEVA CONTRASEÑA</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-black">
                                    <LockClosedIcon className="h-6 w-6" />
                                </div>
                                <input
                                    type="password"
                                    placeholder="MÍNIMO 6 CARACTERES"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border-4 border-black focus:ring-4 focus:ring-yellow-400 focus:outline-none text-black font-bold placeholder-gray-500 shadow-[4px_4px_0_#000] transition-shadow uppercase"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="bg-red-500 text-white font-bold p-3 text-center border-4 border-black shadow-[4px_4px_0_#000] uppercase text-xs transform rotate-1">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-4 text-xl brutal-btn mt-6 ${loading
                                ? 'bg-gray-300 cursor-not-allowed text-black opacity-70 border-4 border-black shadow-[4px_4px_0_#000]'
                                : 'bg-[#FFD500] text-black shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#000]'
                                }`}
                        >
                            {loading ? "GUARDANDO..." : "GUARDAR CONTRASEÑA"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Restablecer;