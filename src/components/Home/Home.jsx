import React, { useContext, useEffect, useRef } from 'react'
import { assets } from '../../assets/assets'
import { Context } from '../../context/context';

function Home() {
    const { state, dispatch, run } = useContext(Context)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [state.messages, state.loading])

    async function handleSubmit(e) {
        e.preventDefault();
        const prompt = state.input.trim()
        if (!prompt || state.loading) {
            return
        }

        dispatch({ type: 'ADD_MESSAGE', payload: { message: { id: Date.now(), role: 'user', content: prompt } } })
        dispatch({ type: 'SET_INPUT', payload: { input: '' } })
        dispatch({ type: 'SET_LOADING', payload: { loading: true } })
        dispatch({ type: 'SET_ERROR', payload: { error: '' } })

        try {
            const result = await run(prompt)
            dispatch({ type: 'ADD_MESSAGE', payload: { message: { id: Date.now() + 1, role: 'assistant', content: result || 'No response returned.' } } })
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: { error: 'Something went wrong. Please try again.' } })
            dispatch({ type: 'ADD_MESSAGE', payload: { message: { id: Date.now() + 1, role: 'assistant', content: 'Something went wrong. Please try again.' } } })
        } finally {
            dispatch({ type: 'SET_LOADING', payload: { loading: false } })
        }
    }

    function handleChange(e) {
        dispatch({ type: 'SET_INPUT', payload: { input: e.target.value } })
    }

    function renderMessageContent(content) {
        const blocks = content.split(/```([\s\S]*?)```/g)

        return blocks.map((block, index) => {
            const isCodeBlock = index % 2 === 1

            if (isCodeBlock) {
                return (
                    <pre key={index} className='overflow-x-auto rounded-2xl border border-slate-700 bg-slate-950/90 p-4 text-sm text-slate-200 whitespace-pre-wrap'>
                        <code>{block.trim()}</code>
                    </pre>
                )
            }

            const lines = block
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)

            return lines.map((line, lineIndex) => {
                if (line.startsWith('### ')) {
                    return <h4 key={`${index}-${lineIndex}`} className='mt-2 text-lg font-semibold text-white'>{line.replace('### ', '')}</h4>
                }

                if (line.startsWith('## ')) {
                    return <h3 key={`${index}-${lineIndex}`} className='mt-2 text-xl font-semibold text-white'>{line.replace('## ', '')}</h3>
                }

                if (line.startsWith('# ')) {
                    return <h2 key={`${index}-${lineIndex}`} className='mt-2 text-2xl font-semibold text-white'>{line.replace('# ', '')}</h2>
                }

                if (/^[-*]\s/.test(line)) {
                    return <li key={`${index}-${lineIndex}`} className='ml-5 list-disc text-slate-200'>{line.replace(/^[-*]\s/, '')}</li>
                }

                if (/^\d+\.\s/.test(line)) {
                    return <li key={`${index}-${lineIndex}`} className='ml-5 list-decimal text-slate-200'>{line.replace(/^\d+\.\s/, '')}</li>
                }

                return <p key={`${index}-${lineIndex}`} className='leading-7 text-slate-200'>{line}</p>
            })
        })
    }

    return (
        <div className='flex min-h-screen w-full flex-col bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_35%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#111827_100%)]'>
            <header className='flex items-center justify-between border-b border-white/10 px-4 py-4 backdrop-blur md:px-8'>
                <div>
                    <p className='text-xs uppercase tracking-[0.35em] text-cyan-300/80'>Gemini Workspace</p>
                    <h2 className='text-xl font-semibold text-white'>Chat Studio</h2>
                </div>
                <img src={assets.profile_icon} className='w-10 rounded-full ring-2 ring-white/10' alt='Profile' />
            </header>

            <main className='flex flex-1 flex-col px-4 py-5 md:px-8'>
                <section className='mx-auto flex w-full max-w-5xl flex-1 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-xl'>
                    <div className='flex-1 overflow-y-auto px-4 py-6 md:px-8'>
                        {state.messages.length === 0 ? (
                            <div className='flex min-h-[55vh] flex-col items-center justify-center text-center'>
                                <div className='max-w-2xl space-y-4'>
                                    <p className='text-sm uppercase tracking-[0.4em] text-cyan-300/80'>Welcome back</p>
                                    <h1 className='bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-200 bg-clip-text text-4xl font-semibold text-transparent md:text-6xl'>
                                        Ask Gemini anything.
                                    </h1>
                                    <p className='mx-auto max-w-xl text-sm leading-7 text-slate-300 md:text-base'>
                                        Start a conversation, get structured answers, and read responses in a cleaner chat layout.
                                    </p>
                                </div>
                                <div className='mt-8 grid gap-3 text-left md:grid-cols-3'>
                                    {['Summarize this document', 'Write a better email', 'Explain this code'].map((item) => (
                                        <button
                                            key={item}
                                            type='button'
                                            onClick={() => dispatch({ type: 'SET_INPUT', payload: { input: item } })}
                                            className='rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/15'
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                {state.messages.map((message) => (
                                    <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[92%] rounded-[1.5rem] px-4 py-3 md:max-w-[80%] ${message.role === 'user' ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20' : 'border border-white/10 bg-slate-900/70 text-slate-100 shadow-lg shadow-black/20'}`}>
                                            <div className='mb-2 text-xs font-medium uppercase tracking-[0.3em] opacity-70'>
                                                {message.role === 'user' ? 'You' : 'Gemini'}
                                            </div>
                                            <div className={`space-y-2 ${message.role === 'user' ? 'whitespace-pre-wrap leading-7' : ''}`}>
                                                {message.role === 'assistant' ? renderMessageContent(message.content) : <p className='whitespace-pre-wrap leading-7'>{message.content}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {state.loading ? (
                                    <div className='flex justify-start'>
                                        <div className='inline-flex items-center gap-2 rounded-[1.5rem] border border-white/10 bg-slate-900/70 px-4 py-3 text-slate-200'>
                                            <span className='h-2 w-2 animate-pulse rounded-full bg-cyan-300'></span>
                                            <span className='h-2 w-2 animate-pulse rounded-full bg-cyan-300 [animation-delay:150ms]'></span>
                                            <span className='h-2 w-2 animate-pulse rounded-full bg-cyan-300 [animation-delay:300ms]'></span>
                                            <span className='ml-1 text-sm text-slate-300'>Gemini is thinking</span>
                                        </div>
                                    </div>
                                ) : null}

                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>

                    <div className='border-t border-white/10 bg-slate-950/50 px-4 py-4 md:px-6'>
                        {state.error ? <p className='mb-3 text-sm text-rose-300'>{state.error}</p> : null}
                        <form className='flex items-end gap-3' onSubmit={handleSubmit}>
                            <div className='flex-1 rounded-3xl border border-white/10 bg-white/10 p-2 shadow-inner shadow-black/20'>
                                <textarea
                                    value={state.input}
                                    onChange={handleChange}
                                    rows='1'
                                    placeholder='Ask Gemini something...'
                                    className='min-h-[56px] w-full resize-none rounded-2xl bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400'
                                />
                            </div>
                            <button
                                type='submit'
                                disabled={state.loading || !state.input.trim()}
                                className='rounded-2xl bg-cyan-400 px-5 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50'
                            >
                                Send
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </div>

    )
}

export default Home
