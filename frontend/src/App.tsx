import Login from './component/Login'
import Footer from './layout/Footer'
import Header from './layout/Header'

function App() {
  return (
    <>
      <div className='min-h-screen flex flex-col'>
        <Header />
        <div className='flex flex-grow bg-white'>
          <Login />
        </div>
        <Footer />
      </div>
    </>
  )
}
export default App
