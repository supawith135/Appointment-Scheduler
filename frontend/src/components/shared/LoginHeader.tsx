import sutLogoWhite from '../../assets/ENGi Lettermark-EN-White.png'
function LoginHeader() {
  return (
      <header className='flex h-20 py-6 bg-ENGi-Red items-center'>
        <div className="flex-1 ">
                <div className='w-1/2 hidden sm:block '>
                    <img src={sutLogoWhite} alt='sutLogoWhite' className='max-w-56 ml-10'  ></img>
                </div>
            </div>
      </header>
  );
}

export default LoginHeader;