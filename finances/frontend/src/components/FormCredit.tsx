import axios from "axios";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function FormCredit(): JSX.Element {
    const navigate = useNavigate();

    const sendForm = (event: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const data: { [key: string]: string } = {};

        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        axios.post('http://localhost:3000/balance/credit', data)

        navigate("/overheads");
    }

    return (
        <form onSubmit={sendForm} className="w-full mx-auto p-3">
            <span className="border-b-2 border-[#c9b977]">Despesas em Crédito</span>
            <div className="mt-8 items-center group">
                <label htmlFor="creditExpense" className="absolute px-1 py-1 text-black pointer-events-none duration-300  group-has-[:focus]:text-white group-has-[:focus]:text-sm group-has-[:focus]:translate-y-[-28px] group-has-[:valid]:text-white group-has-[:valid]:text-sm group-has-[:valid]:translate-y-[-28px]">Qual foi a despesa no crédito? (Ex: Lider)</label>
                <input id="creditExpense" className="text-black p-1 mr-5 rounded-md w-[70%] placeholder:text-gray-400 max-md:w-11/12" name="creditExpense" type="text" required />
            </div>
            <div className="mt-7 items-center">
                <div className="group">
                    <label htmlFor="creditExpenseAmount" className="absolute px-1 py-1 text-black pointer-events-none duration-300  group-has-[:focus]:text-white group-has-[:focus]:text-sm group-has-[:focus]:translate-y-[-28px] group-has-[:valid]:text-white group-has-[:valid]:text-sm group-has-[:valid]:translate-y-[-28px]">Novo Saldo (Ex: R$300)</label>
                    <input id="creditExpenseAmount" className="text-black p-1 mr-5 rounded-md placeholder:text-gray-400" name="creditExpenseAmount" type="text" required />
                </div>
                <div className="mt-7 group">
                    <label htmlFor="creditExpenseAmount" className="absolute px-1 py-1 text-black pointer-events-none duration-300  group-has-[:focus]:text-white group-has-[:focus]:text-sm group-has-[:focus]:translate-y-[-28px] group-has-[:valid]:text-white group-has-[:valid]:text-sm group-has-[:valid]:translate-y-[-28px]">Descrição do Gasto (Ex: Relógio de presente)</label>
                    <textarea id="description" className="w-full max-h-14 text-black p-1 mr-5 rounded-md" name="description" required ></textarea>
                </div>
            </div>
            <div className="mt-10 flex justify-center gap-10">
                <input className="bg-[#19191a] py-2 px-5 rounded-md duration-300 hover:bg-[#c9b977] hover:text-black hover:font-bold" type="submit" value="Enviar"/>
                <input className="bg-[#19191a] py-2 px-5 rounded-md duration-300 hover:bg-[#c9b977] hover:text-black hover:font-bold" type="reset" value="Limpar"/>
            </div>
        </form>
    )
}