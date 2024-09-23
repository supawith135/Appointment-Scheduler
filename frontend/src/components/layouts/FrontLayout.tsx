import Header from '../shared/Header'
import Footer from '../shared/Footer'
import Navbar from '../shared/Navbar'

type Props = {
  children: JSX.Element | JSX.Element[]
}

function FrontLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <Navbar />
      <div className="flex-grow bg-white">
        <div className="h-full sm:pt-20 lg:pt-8">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default FrontLayout