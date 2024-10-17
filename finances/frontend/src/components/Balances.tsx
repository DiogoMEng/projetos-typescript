import { useEffect, useState } from "react";
import { BalanceProtocol } from "../interfaces/Balance.protocol";
import axios from "axios";
import { formattedDate } from "../utils/formattedDate";

function Balances (): JSX.Element {
    const [accounts, setAccounts] = useState<BalanceProtocol[] | null>(null);

    
    useEffect(() => {
        axios.get("http://localhost:3000/balances/").then((res) => {
            setAccounts(res.data);
        });
    }, []);

    if(!accounts) return null!;

    console.log(accounts);

    return (
        <div className="flex max-h-72 justify-center rounded-md overflow-y-auto scroolbar-gutter-stable">
            <table className="w-10/12 border-collapse max-md:w-full">
                <thead>
                    <tr className="border-b-2">
                        <th className="w-40">Valor</th>
                        <th className="w-40">Status</th>
                        <th className="w-40">Data de Pagamento</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts.map((account, index) => (
                        <tr className="border-b-[1px] text-center even:bg-[#373739]" key={index}>
                            <td className="duration-300 hover:py-2">R${account.valor_conta}</td>
                            <td className="duration-300 hover:py-2">{account.status_recebimento != false ? "Pago" : "Pendente"}</td>
                            <td className="duration-300 hover:py-2">{formattedDate(account.dt_recebimento)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Balances;