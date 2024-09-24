
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <>
      <div className="flex flex-col h-screen">
        <Outlet />
      </div>
      <div></div>
    </>
  )
}
export default App
