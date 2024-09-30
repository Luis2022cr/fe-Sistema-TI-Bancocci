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
          Sistema TI Bancocci
          </span>
        </span>
        {/* <nav className="ml-auto hidden md:flex gap-4 text-white">
          <span
            onClick={() => {
              navigate("/login");
            }}
            className="text-sm hover:underline cursor-pointer"
          >
            Acceder
          </span>
        </nav> */}
      </header>
    </>
  );
}
