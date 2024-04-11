import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router.tsx'
import { ContextProvider } from './contexts/ContextProvider.tsx'
import './index.scss';
// import 'bulma/css/bulma.css';
// ReactDOM.createRoot(document.getElementById('root')!).render(

//   <ContextProvider>
//     <RouterProvider router={router}></RouterProvider>
//   </ContextProvider>

// )

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ContextProvider>
      <RouterProvider router={router}></RouterProvider>
    </ContextProvider>
  </React.StrictMode>,
)
