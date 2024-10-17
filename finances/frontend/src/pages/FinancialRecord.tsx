import FormBalance from "../components/FormBalance";
import FormExpense from "../components/FormExpense";
import FormCredit from "../components/FormCredit";

export default function FinancialRecord(): JSX.Element {
    return (
        <section className="bg-[#19191a] min-h-screen relative text-white p-4">
            <h1 className="bg-[#020202] w-60 m-auto mb-2 p-1 text-center text-2xl font-bold border-b-4 border-r-4 border-[#c9b977] rounded-md">Novos Registros</h1>
            <div className="bg-[#020202] flex flex-row mx-auto p-3 rounded-md max-md:flex-col">
                {/* BALANCE */}
                <FormBalance />

                {/* EXPENSES */}
                <FormExpense />

                {/* CREDIT */}
                <FormCredit />
            </div>
        </section>
    )
}