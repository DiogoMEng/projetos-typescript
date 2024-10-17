import axios from "axios";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function FormExpense(): JSX.Element {
    const navigate = useNavigate();

    const sendForm = (event: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const data: { [key: string]: string } = {};

        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        
        axios.post('http://localhost:3000/balance/expense', data)
        
        navigate("/overheads");
    }

    return (
        <form  onSubmit={sendForm} className="w-full mx-auto p-3 border-r-2 border-white max-md:border-none max-md:mt-5">
            <span className="border-b-2 border-[#c9b977]">Despesas em Débito/Dinheiro</span>
            <div className="mt-8 items-center group">
                <label htmlFor="expense" className="absolute px-1 py-1 text-black pointer-events-none duration-300  group-has-[:focus]:text-white group-has-[:focus]:text-sm group-has-[:focus]:translate-y-[-28px] group-has-[:valid]:text-white group-has-[:valid]:text-sm group-has-[:valid]:translate-y-[-28px]">Qual foi a despesa? (Ex: Amazon Store)</label>
                <input id="expense" className="text-black p-1 mr-5 rounded-md w-11/12 placeholder:text-gray-400" name="expense" type="text" required />
            </div>
            <div className="flex mt-7 items-center max-md:block">
                <div className="group max-md:mb-5">
                    <label htmlFor="expenseAmount" className="absolute px-1 py-1 text-black pointer-events-none duration-300  group-has-[:focus]:text-white group-has-[:focus]:text-sm group-has-[:focus]:translate-y-[-28px] group-has-[:valid]:text-white group-has-[:valid]:text-sm group-has-[:valid]:translate-y-[-28px]">Novo Saldo (Ex: R$100)</label>
                    <input id="expenseAmount" className="text-black p-1 mr-5 rounded-md placeholder:text-gray-400" name="expenseAmount" type="text" required />
                </div>
                <label htmlFor="expenseStatus">O pagamento já relizado?</label>
                <input id="expenseStatus" className="w-4 h-4 ml-3" name="expenseStatus" type="checkbox" defaultChecked />
            </div>
            <div className="mt-10 flex justify-center gap-10">
                <input className="bg-[#19191a] py-2 px-5 rounded-md duration-300 hover:bg-[#c9b977] hover:text-black hover:font-bold" type="submit" value="Enviar"/>
                <input className="bg-[#19191a] py-2 px-5 rounded-md duration-300 hover:bg-[#c9b977] hover:text-black hover:font-bold" type="reset" value="Limpar"/>
            </div>
        </form>
    )
}