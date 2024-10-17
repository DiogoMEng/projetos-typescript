import iconFinances from "../assets/img/icon-finance.png"

const NavBar = (): JSX.Element => {
    return (
        <nav className="flex bg-[#373739] items-center justify-between px-5 text-white">
            <div className="flex items-center text-3xl"><img src={iconFinances} className="py-4 mr-3" alt="icon-finances" width={70} height={70}/>Finances</div>

            <div>
                    <ul className="nav-links">
                        <input className='hidden' type="checkbox" id="checkbox_toggle"/>
                        <label htmlFor="checkbox_toggle" className="hidden text-2xl max-md:block">&#9776; </label>
                        <div className="menu flex gap-4 text-lg max-md:hidden max-md:absolute max-md:bg-[#1a18a4] max-md:inset-x-0 max-md:text-center max-md:py-4 max-md:px-0 max-md:mt-4">
                            <li className='py-1 px-2'><a className="duration-75 hover:px-2 hover:border-b-2 hover:border-solid" href="/">Saldos</a></li>
                            <li className='py-1 px-2'><a className="duration-75 hover:px-2 hover:border-b-2 hover:border-solid" href="/overheads">Despesas</a></li>
                            <li className='py-1 px-2'><a className="duration-75 hover:px-2 hover:border-b-2 hover:border-solid" href="/financialRecord">Registros</a></li>
                        </div>
                    </ul>
            </div>
        </nav>
    );
};

export default NavBar;