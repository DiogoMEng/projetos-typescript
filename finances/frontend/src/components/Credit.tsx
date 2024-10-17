import { useEffect, useState } from "react";
import { ExpensesCreditProtocol } from "../interfaces/Balance.protocol";
import axios from "axios";
import { formattedDate } from "../utils/formattedDate";

function Credit(): JSX.Element {
    const [credits, setCredit] = useState<ExpensesCreditProtocol[] | null>(null);

    useEffect(() => {
        axios.get("http://localhost:3000/balances/credit").then((res) => {
            setCredit(res.data);
        });
    }, []);

    if(!credits) return null!;

    return (
        <div className="max-h-72 overflow-y-auto">
            <table className="w-11/12 m-auto border-collapse">
                <thead>
                    <tr className="border-b-2">
                        <th className="w-20">Valor</th>
                        <th className="w-20">Despesa</th>
                        <th className="w-44 max-md:w-20">Descrição de Gasto</th>
                        <th className="w-20">Data de Gasto</th>
                    </tr>
                </thead>
                <tbody>
                    {credits.map((credit, index) => (
                        <tr className="border-b-[1px] text-center even:bg-[#373739]" key={index}>
                            <td className="duration-300 hover:py-2">R${credit.valor_credito}</td>
                            <td className="duration-300 hover:py-2">{credit.despesa_credito}</td>
                            <td className="duration-300 hover:py-2">{credit.descricao}</td>
                            <td className="duration-300 hover:py-2">{formattedDate(credit.dt_despesa_credito)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Credit;