import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import { Context } from '../../context/context'

function Sidebar() {
    const { state, dispatch } = useContext(Context)
    function toggle() {
        dispatch({ type: 'EXTENDED_TOGGLE' })
    }
    return (
        <aside className={`flex h-screen flex-col justify-between border-r border-white/10 bg-[#0f172a]/90 text-slate-100 backdrop-blur-xl ${state.extended ? 'w-72' : 'w-20'} transition-all duration-300 ease-in-out`}>

            {/* Menu Icon */}
            <div className='flex items-center gap-3 px-4 pt-5'>
                <button type='button' onClick={toggle} className='inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10'>
                    <img src={assets.menu_icon} alt='Toggle sidebar' className='w-[22px] brightness-0 invert opacity-95' />
                </button>
                {state.extended ? <p className='text-sm font-medium tracking-[0.25em] text-amber-300/80'>GEMINI</p> : null}
            </div>

            {/* New Chat Button */}
            <button type='button' className={`mx-4 mt-6 inline-flex items-center gap-3 rounded-2xl border border-amber-300/20 bg-amber-300 px-4 py-3 text-slate-950 shadow-lg shadow-amber-500/10 transition hover:bg-amber-200 ${state.extended ? 'justify-start' : 'justify-center'}`}>
                <img src={assets.plus_icon} className='w-[18px] brightness-0' alt='' />
                {state.extended ?
                    <p className='font-semibold'>New chat</p>
                    : null}
            </button>

            {/* Spacer for Recent Section */}
            <div className='px-4 pt-8'>
                {state.extended ? (
                    <div className='rounded-3xl border border-white/10 bg-white/5 p-4'>
                        <p className='text-xs uppercase tracking-[0.35em] text-slate-400'>Recent</p>
                        <div className='mt-4 flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3'>
                            <img src={assets.message_icon} className='w-[22px] brightness-0 invert opacity-90' alt='' />
                            <p className='text-sm text-slate-200'>No recent chats yet</p>
                        </div>
                    </div>
                ) : null}
            </div>

            <div className='mb-6 flex flex-col gap-3 px-4'>
                <div className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition hover:bg-white/10'>
                    <img src={assets.history_icon} className='w-[20px] brightness-0 invert opacity-90' alt='' />
                </div>
                <div className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition hover:bg-white/10'>
                    <img src={assets.question_icon} className='w-[20px] brightness-0 invert opacity-90' alt='' />
                </div>
                <div className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition hover:bg-white/10'>
                    <img src={assets.setting_icon} className='w-[20px] brightness-0 invert opacity-90' alt='' />
                </div>
            </div>
        </aside >
    )

}

export default Sidebar
