import Balances from "../components/Balances";

export default function Balance() {
    return (
        <>
            <section className="bg-[#19191a] text-white min-h-screen">
                <h1 className="bg-[#020202] w-60 m-auto mt-5 mb-2 p-1 text-center text-2xl font-bold border-b-4 border-r-4 border-[#c9b977] rounded-md">Saldos da Conta</h1>
                <div className="bg-[#020202] mx-auto w-3/5 p-2 rounded-md max-md:w-[95%]">
                    <Balances />
                </div>
            </section>
        </>
    )
}