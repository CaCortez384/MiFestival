import React, { useState, useEffect, useContext } from 'react';
import useSEO from "../hooks/useSEO";
import { AuthContext } from '../context/AuthContext';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { updateProfile, deleteUser, sendPasswordResetEmail } from 'firebase/auth';
// CORRECCIÓN AQUÍ: Se agregó Link
import { useNavigate, Link } from 'react-router-dom';
import mflogo from "../assets/mflogo20.png";
import {
    UserCircleIcon, FireIcon, TicketIcon, ArrowLeftIcon,
    PencilSquareIcon, ArrowRightOnRectangleIcon, TrashIcon,
    LockClosedIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon,
    HeartIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const Perfil = () => {
    const { user, setUser } = useContext(AuthContext);

    useSEO({
        title: 'Mi Perfil | MiFestival',
        description: 'Tu perfil en MiFestival. Estadísticas, insignias y configuración de cuenta.',
        noindex: true,
    });
    const [stats, setStats] = useState({ totalFestivales: 0, totalLikes: 0 });
    const [favorites, setFavorites] = useState([]);
    const [activeTab, setActiveTab] = useState('stats');
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(user?.displayName || "");

    // Estado para validar la palabra "ELIMINAR"
    const [deleteInput, setDeleteInput] = useState('');

    // Estado del Modal
    const [modal, setModal] = useState({
        show: false,
        type: '',
        title: '',
        message: '',
        onConfirm: null
    });

    const navigate = useNavigate();

    const showModal = (type, title, message, onConfirm = null) => {
        setModal({ show: true, type, title, message, onConfirm });
    };

    const closeModal = () => {
        setModal({ ...modal, show: false });
        setDeleteInput('');
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const qStats = query(collection(db, "festivals"), where("userId", "==", user.uid));
                const snapshotStats = await getDocs(qStats);
                let count = 0;
                let likes = 0;
                snapshotStats.forEach((doc) => {
                    count++;
                    likes += (doc.data().likes || 0);
                });
                setStats({ totalFestivales: count, totalLikes: likes });

                const qFavs = query(collection(db, "festivals"), where("likesBy", "array-contains", user.uid));
                const snapshotFavs = await getDocs(qFavs);
                const favsData = snapshotFavs.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFavorites(favsData);

            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const handleUpdateName = async () => {
        if (!newName.trim()) return;
        try {
            await updateProfile(auth.currentUser, { displayName: newName });
            setUser({ ...user, displayName: newName });
            setIsEditing(false);
            showModal('success', '¡Nombre Actualizado!', 'Tu perfil ahora luce genial con tu nuevo nombre.');
        } catch (error) {
            console.error(error);
            showModal('error', 'Error', 'No se pudo actualizar el nombre.');
        }
    };

    const handleChangePassword = async () => {
        if (user.providerData?.[0]?.providerId === 'google.com') {
            showModal('error', 'Cuenta de Google', 'Debes cambiar tu contraseña desde tu configuración de Google.');
            return;
        }

        showModal('confirm', '¿Cambiar contraseña?', `Enviaremos un correo a ${user.email} para restablecerla.`, async () => {
            try {
                await sendPasswordResetEmail(auth, user.email);
                closeModal();
                setTimeout(() => showModal('success', 'Correo Enviado', 'Revisa tu bandeja de entrada.'), 300);
            }
            catch (error) {
                console.error(error);
                closeModal();
                showModal('error', 'Error', 'No se pudo enviar el correo.');
            }
        });
    };

    const handleLogout = async () => { await auth.signOut(); navigate('/'); };

    const handleDeleteAccountRequest = () => {
        setDeleteInput('');
        showModal('delete-account', '¿Eliminar Cuenta Permanentemente?', 'Esta acción borrará todos tus festivales y datos. No hay vuelta atrás.', executeDeleteAccount);
    };

    const executeDeleteAccount = async () => {
        setModal({ ...modal, type: 'loading', title: 'Eliminando...', message: 'Por favor espera.' });

        try {
            const q = query(collection(db, "festivals"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const deletePromises = querySnapshot.docs.map(d => deleteDoc(doc(db, "festivals", d.id)));
            await Promise.all(deletePromises);

            await deleteUser(auth.currentUser);
            navigate('/');

        } catch (error) {
            console.error("Error eliminando cuenta:", error);
            closeModal();

            if (error.code === 'auth/requires-recent-login') {
                setTimeout(() => {
                    showModal('error', 'Seguridad', 'Para eliminar tu cuenta, necesitas haber iniciado sesión recientemente. Por favor, cierra sesión e ingresa de nuevo.');
                }, 300);
            } else {
                setTimeout(() => {
                    showModal('error', 'Error Crítico', 'Ocurrió un error al intentar eliminar la cuenta.');
                }, 300);
            }
        }
    };

    const getBadges = () => {
        const badges = [];
        if (stats.totalFestivales >= 1) badges.push({ label: "Creador", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" });
        if (stats.totalFestivales >= 5) badges.push({ label: "Promotor Pro", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" });
        if (stats.totalLikes >= 1) badges.push({ label: "Primer Fan", color: "bg-pink-500/20 text-pink-400 border-pink-500/30" });
        if (stats.totalLikes >= 10) badges.push({ label: "Rising Star", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" });
        if (stats.totalLikes >= 50) badges.push({ label: "Leyenda", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" });
        return badges;
    };

    if (!user) return null;
    const isGoogleUser = user.providerData?.[0]?.providerId === 'google.com';
    const userBadges = getBadges();

    return (
        <div className="min-h-screen flex flex-col bg-brutal-base text-[#050510] font-inter relative overflow-x-hidden border-x-4 border-black max-w-[1600px] mx-auto">

            {/* Fondo Textura */}
            <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

            {/* --- HEADER --- */}
            <header className="w-full px-4 sm:px-6 py-4 border-b-4 border-black sticky top-0 z-50 bg-white">
                <div className="container mx-auto flex justify-between items-center max-w-[1400px]">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="relative border-2 border-black rounded-none shadow-[2px_2px_0px_#000]">
                            <img src={mflogo} alt="MiFestival Logo" className="relative w-8 h-8 sm:w-9 sm:h-9 object-cover" />
                        </div>
                        <span className="text-lg sm:text-xl brutal-title hidden sm:inline bg-[#00E5FF] px-2 mt-1 border-2 border-black rotate-1">MI PERFIL</span>
                    </div>
                    <button onClick={() => navigate('/inicio')} className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black border-2 border-black hover:bg-yellow-400 shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all bg-white"><ArrowLeftIcon className="w-5 h-5" />Volver</button>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl relative z-10">

                {/* --- TARJETA DE PERFIL --- */}
                <div className="bg-[#FFD500] border-4 border-black shadow-[8px_8px_0_#000] p-8 relative overflow-hidden mb-12 transform -rotate-1">

                    <div className="flex flex-col items-center text-center relative z-10">
                        <div className="relative mb-6">
                            <div className="w-28 h-28 border-4 border-black bg-white flex items-center justify-center shadow-[4px_4px_0_#000]">
                                <UserCircleIcon className="w-20 h-20 text-gray-300 stroke-1" />
                            </div>
                            <button onClick={() => setIsEditing(!isEditing)} className="absolute -bottom-2 -right-2 bg-[#00FF66] border-2 border-black p-2 shadow-[2px_2px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none transition-all">
                                <PencilSquareIcon className="w-5 h-5 text-black" />
                            </button>
                        </div>

                        {isEditing ? (
                            <div className="flex gap-2 mb-4 w-full max-w-xs justify-center bg-white border-4 border-black p-2 shadow-[4px_4px_0_#000] transform rotate-1">
                                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-transparent border-none text-center text-black font-bold uppercase focus:ring-0 outline-none w-full" placeholder="NUEVO NOMBRE" />
                                <button onClick={handleUpdateName} className="bg-[#00FF66] border-2 border-black px-4 py-2 text-sm font-black text-black hover:bg-yellow-400 transition-colors">OK</button>
                            </div>
                        ) : (
                            <h1 className="text-4xl md:text-5xl brutal-title mb-2 bg-white border-4 border-black inline-block px-4 py-2 shadow-[4px_4px_0_#000] rotate-1">{user.displayName || "USUARIO"}</h1>
                        )}
                        <p className="text-lg font-bold text-black bg-white/80 px-2 mt-2">{user.email}</p>

                        <div className="flex flex-wrap justify-center gap-3 mt-8">
                            {userBadges.length > 0 ? userBadges.map((badge, i) => (
                                <span key={i} className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-white shadow-[2px_2px_0_#000] transform ${i % 2 === 0 ? 'rotate-2' : '-rotate-2'}`}>
                                    {badge.label}
                                </span>
                            )) : (
                                <span className="px-4 py-2 text-xs font-black uppercase tracking-widest border-2 border-black bg-gray-200">SIN INSIGNIAS AÚN</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- TABS --- */}
                <div className="flex mb-8 gap-4">
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`flex-1 py-4 text-lg font-black uppercase tracking-widest border-4 border-black transition-all ${activeTab === 'stats' ? 'bg-[#FF90E8] shadow-[4px_4px_0_#000] text-black translate-y-[-4px]' : 'bg-white text-black hover:bg-yellow-50 shadow-[2px_2px_0_#000]'}`}
                    >
                        ESTADÍSTICAS
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`flex-1 py-4 text-lg font-black uppercase tracking-widest border-4 border-black transition-all ${activeTab === 'favorites' ? 'bg-[#00E5FF] shadow-[4px_4px_0_#000] text-black translate-y-[-4px]' : 'bg-white text-black hover:bg-cyan-50 shadow-[2px_2px_0_#000]'}`}
                    >
                        FAVS ({favorites.length})
                    </button>
                </div>

                {activeTab === 'stats' ? (
                    <div className="animate-fade-in-up">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-[#00FF66] border-4 border-black p-8 flex flex-col items-center shadow-[6px_6px_0_#000] transform rotate-1">
                                <span className="text-6xl brutal-title text-black mb-2 bg-white px-4 border-4 border-black shadow-[4px_4px_0_#000]">{stats.totalFestivales}</span>
                                <span className="text-sm text-black font-black uppercase tracking-widest flex items-center gap-2 mt-4 bg-white px-2 border-2 border-black">
                                    <TicketIcon className="w-6 h-6" /> FESTIVALES
                                </span>
                            </div>
                            <div className="bg-[#FF90E8] border-4 border-black p-8 flex flex-col items-center shadow-[6px_6px_0_#000] transform -rotate-1">
                                <span className="text-6xl brutal-title text-black mb-2 bg-white px-4 border-4 border-black shadow-[4px_4px_0_#000]">{stats.totalLikes}</span>
                                <span className="text-sm text-black font-black uppercase tracking-widest flex items-center gap-2 mt-4 bg-white px-2 border-2 border-black">
                                    <FireIcon className="w-6 h-6" /> IMPACTO SOCIAL
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {!isGoogleUser && !user.isGuest && (
                                <button onClick={handleChangePassword} className="w-full flex items-center justify-center gap-3 bg-white border-4 border-black text-black font-bold uppercase text-lg py-4 shadow-[4px_4px_0_#000] hover:bg-yellow-400 hover:shadow-[6px_6px_0_#000] transition-all">
                                    <LockClosedIcon className="w-6 h-6" /> CAMBIAR CONTRASEÑA
                                </button>
                            )}
                            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 bg-white border-4 border-black text-black font-bold uppercase text-lg py-4 shadow-[4px_4px_0_#000] hover:bg-yellow-400 hover:shadow-[6px_6px_0_#000] transition-all">
                                <ArrowRightOnRectangleIcon className="w-6 h-6" /> CERRAR SESIÓN
                            </button>

                            {!user.isGuest && (
                                <button onClick={handleDeleteAccountRequest} className="w-full text-white bg-red-600 border-4 border-black text-lg py-4 transition font-black uppercase tracking-widest shadow-[4px_4px_0_#000] hover:bg-red-500 hover:shadow-[6px_6px_0_#000] mt-8">
                                    ELIMINAR CUENTA PERMANENTEMENTE
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fade-in-up">
                        {favorites.length > 0 ? favorites.map(fav => (
                            <Link to={`/festival/${fav.id}/artistas`} key={fav.id} className="bg-white border-4 border-black shadow-[6px_6px_0_#000] p-5 hover:bg-yellow-50 hover:-translate-y-1 transition-all group">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-xl brutal-title truncate pr-2 group-hover:text-[#00E5FF] transition-colors">{fav.name}</h4>
                                    <span className="flex items-center gap-1 text-sm font-black text-black border-2 border-black bg-[#FF90E8] px-2 py-1 shadow-[2px_2px_0_#000]">
                                        <HeartIconSolid className="w-4 h-4" /> {fav.likes}
                                    </span>
                                </div>
                                <div className="text-sm text-black font-bold flex gap-4 bg-gray-100 p-2 border-2 border-black">
                                    <span className="flex items-center gap-2"><CalendarDaysIcon className="w-4 h-4" /> {fav.days} DÍAS</span>
                                    <span className="flex items-center gap-2"><UserCircleIcon className="w-4 h-4" /> {fav.userName || 'ANON'}</span>
                                </div>
                            </Link>
                        )) : (
                            <div className="col-span-full text-center py-16 bg-white border-4 border-black border-dashed shadow-[8px_8px_0_#000] transform rotate-1">
                                <HeartIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <p className="text-xl brutal-title mb-4">AÚN NO TIENES FAVORITOS.</p>
                                <Link to="/explorar" className="inline-block bg-[#00E5FF] brutal-btn py-3 px-8 text-lg">IR A EXPLORAR</Link>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* --- MODAL --- */}
            {modal.show && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-white border-4 border-black shadow-[16px_16px_0_#000] p-8 w-full max-w-md relative transform transition-all -rotate-1">

                        <div className="flex justify-center mb-6">
                            {modal.type === 'success' && <div className="bg-[#00FF66] p-4 border-4 border-black rounded-full shadow-[4px_4px_0_#000]"><CheckCircleIcon className="w-10 h-10 text-black" /></div>}
                            {modal.type === 'error' && <div className="bg-red-500 p-4 border-4 border-black rounded-full shadow-[4px_4px_0_#000]"><XCircleIcon className="w-10 h-10 text-white" /></div>}
                            {(modal.type === 'confirm' || modal.type === 'delete-account') && <div className="bg-[#FFD500] p-4 border-4 border-black rounded-full shadow-[4px_4px_0_#000]"><ExclamationTriangleIcon className="w-10 h-10 text-black" /></div>}
                            {modal.type === 'loading' && (
                                <div className="bg-white p-4 border-4 border-black rounded-full shadow-[4px_4px_0_#000]"><div className="animate-spin h-10 w-10 border-4 border-black border-b-transparent rounded-full"></div></div>
                            )}
                        </div>

                        <h3 className="text-2xl brutal-title text-black text-center mb-4 bg-yellow-400 inline-block px-4 py-2 border-2 border-black rotate-1">{modal.title}</h3>
                        <p className="text-black text-center font-bold mb-8 text-lg border-2 border-dashed border-black p-4">{modal.message}</p>

                        {modal.type === 'delete-account' && (
                            <div className="mb-8">
                                <label className="block text-sm font-black uppercase tracking-widest text-black mb-2 text-center bg-red-500 text-white border-2 border-black inline-block px-2">
                                    Escribe "ELIMINAR" para confirmar
                                </label>
                                <input
                                    type="text"
                                    value={deleteInput}
                                    onChange={(e) => setDeleteInput(e.target.value)}
                                    className="w-full bg-white border-4 border-black shadow-[4px_4px_0_#000] py-3 px-4 text-center text-black font-bold uppercase text-xl focus:border-red-500 focus:ring-0 outline-none transition"
                                    placeholder="ELIMINAR"
                                />
                            </div>
                        )}

                        <div className="flex gap-4">
                            {(modal.type === 'confirm' || modal.type === 'delete-account') ? (
                                <>
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 bg-white border-4 border-black text-black font-bold uppercase py-4 shadow-[4px_4px_0_#000] hover:bg-gray-200 transition"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        onClick={modal.onConfirm}
                                        disabled={modal.type === 'delete-account' && deleteInput !== 'ELIMINAR'}
                                        className={`flex-1 border-4 border-black font-bold uppercase py-4 shadow-[4px_4px_0_#000] transition ${modal.type === 'delete-account' && deleteInput !== 'ELIMINAR'
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                            : 'bg-red-600 hover:bg-red-500 text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]'
                                            }`}
                                    >
                                        CONFIRMAR
                                    </button>
                                </>
                            ) : modal.type !== 'loading' && (
                                <button
                                    onClick={closeModal}
                                    className="w-full bg-[#00FF66] brutal-btn py-4 text-xl"
                                >
                                    ENTENDIDO
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* --- FOOTER --- */}
            <footer className="w-full py-8 text-center text-sm font-black uppercase tracking-widest text-black border-t-4 border-black bg-white mt-10 relative z-10">
                <div className="container mx-auto px-4">
                    © {new Date().getFullYear()} MiFestival. HAZ RUIDO.
                </div>
            </footer>
        </div>
    );
};

export default Perfil;