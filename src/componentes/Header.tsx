export default function Header() {
  // const navigate = useNavigate();

  return (
    <>
      <header className="px-4 lg:px-6 h-14 flex items-center bg-primary text-primary-foreground bg-green-900">
          {/* <h1 className="text-2xl text-white ">Sistema TI Bancocci</h1> */}
          <span
          className="flex items-center justify-center"
        >
          <span className="text-xs md:text-lg font-bold text-white ml-2">
          Sistema Bancocci Zona Occidente
          </span>
        </span>
        
      </header>
    </>
  );
}
