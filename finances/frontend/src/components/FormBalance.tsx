import axios from "axios";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function FormBalance(): JSX.Element {
    const navigate = useNavigate();

    const sendForm = (event: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const data: { [key: string]: string } = {};

        formData.forEach((value, key) => {
            data[key] = value.toString();
        });

        console.log(data);

        axios.post('http://localhost:3000/balance', data);

        navigate("/");
    }

    return (
        <form onSubmit={sendForm} className="w-full mx-auto p-3 border-r-2 border-white max-md:border-none">
            <span className="border-b-2 border-[#c9b977]">Novo Saldo da Conta</span>
            <div className="flex mt-8 items-center max-md:block">
                <div className="group max-md:mb-5">
                    <label htmlFor="balance" className="absolute px-1 py-1 text-black pointer-events-none duration-300  group-has-[:focus]:text-white group-has-[:focus]:text-sm group-has-[:focus]:translate-y-[-28px] group-has-[:valid]:text-white group-has-[:valid]:text-sm group-has-[:valid]:translate-y-[-28px]">Inserir Saldo (Ex: 1200)</label>
                    <input id="balance" className="text-black p-1 mr-5 rounded-md" name="accountValue" type="text" required />
                </div>
                <label htmlFor="paycheck">O pagamento já relizado?</label>
                <input id="paycheck" className="w-4 h-4 ml-3" name="receiptStatus" type="checkbox" defaultChecked />
            </div>
            <div className="mt-10 flex justify-center gap-10">
                <input className="bg-[#19191a] py-2 px-5 rounded-md duration-300 hover:bg-[#c9b977] hover:text-black hover:font-bold" type="submit" value="Enviar"/>
                <input className="bg-[#19191a] py-2 px-5 rounded-md duration-300 hover:bg-[#c9b977] hover:text-black hover:font-bold" type="reset" value="Limpar"/>
            </div>
        </form>
    )
}