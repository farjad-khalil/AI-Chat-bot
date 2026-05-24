import React, { useReducer } from 'react'
import Sidebar from './components/sidebar/Sidebar'
import { Context } from './context/context'
import Home from './components/Home/Home'
import run from './config/gemini'

function reducer(state, action) {
   switch (action.type) {
      case 'EXTENDED_TOGGLE': {
         return {
            ...state,
            extended: !state.extended
         }
      }
      case 'SET_INPUT':{
         return{
            ...state,
            input: action.payload.input
         }
      }
      case 'SET_LOADING':{
         return{
            ...state,
            loading: action.payload.loading
         }
      }
      case 'ADD_MESSAGE':{
         return{
            ...state,
            messages: [...state.messages, action.payload.message]
         }
      }
      case 'CLEAR_MESSAGES':{
         return{
            ...state,
            messages: []
         }
      }
      case 'SET_ERROR':{
         return{
            ...state,
            error: action.payload.error
         }
      }

   }

}
function App() {
   const [state, dispatch] = useReducer(reducer, initialState)
   return (
      <div className='min-h-screen bg-slate-950 text-slate-100'>
         <Context.Provider value={{ state, dispatch ,run }}>
            <div className='flex '>
               <Sidebar />
               <Home />
            </div>
         </Context.Provider>
      </div>
   )
}

export default App

const initialState = {
   extended: false,
   input:'',
   loading:false,
   error:'',
   messages: []
}