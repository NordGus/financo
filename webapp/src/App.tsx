import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='mx-auto my-auto max-w-[60dvw] h-[100dvh] flex flex-col justify-center items-center gap-4'>
      <div className='flex justify-center items-center gap-10'>
        <a href="https://vitejs.dev" target="_blank">
          <img
            src={viteLogo}
            className="hover:drop-shadow-[0_0_1.5rem_#d946ef] w-20 h-20"
            alt="Vite logo"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className="animate-spin-slow hover:drop-shadow-[0_0_1.5rem_#0ea5e9] w-20 h-20"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className='text-5xl text-neutral-100'>Vite + React</h1>
      <div className="card flex flex-col justify-center items-center gap-2">
        <button
          className='px-4 py-1.5 bg-neutral-900 text-neutral-100 rounded hover:ring-2'
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className='text-neutral-100'>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-neutral-400">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
