import { cls } from "@libs/client/utiles";
import { ChangeEvent, useEffect, useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface InputProps {
    label: string;
    name: string;
    kind?: "text" | "phone" | "price" | "rank" | "file" | "salefind";
    type: string;
    register: UseFormRegisterReturn;
    required?: boolean;
}

const Input = ({ label, name, kind = "text", register, type, required = false }: InputProps) => {
    const [labelText, setLabelText] = useState("")

    const filelabelchange = (event: ChangeEvent<HTMLInputElement>) => {
        console.log(event);
        if (event.target.files && event.target.files.length > 0) {
            setLabelText(event.target.files[0].name);
        }
    }
    useEffect(() => {
        if (label) { setLabelText(label); }
    }, [label])

    return (
        <div>
            <label
                className={cls("mb-1 block text-sm font-medium text-gray-700", kind === "file" ? "w-full px-3 py-2 text-center bg-green-400 rounded-full shadow-md shadow-stone-600" : "")}
                htmlFor={name}
            >
                {labelText}
            </label>
            {kind === "text" ? (
                <div className="rounded-md relative flex  items-center shadow-sm">
                    <input
                        id={name}
                        required={required}
                        {...register}
                        type={type}
                        className="appearance-none w-full px-3 py-2 border border-blue-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
            ) : null}
            {kind === "price" ? (
                <div className="rounded-md relative flex  items-center shadow-sm">
                    <div className="absolute left-0 pointer-events-none pl-3 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">$</span>
                    </div>
                    <input
                        id={name}
                        required={required}
                        {...register}
                        type={type}
                        className="appearance-none pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                    <div className="absolute right-0 pointer-events-none pr-3 flex items-center">
                        <span className="text-gray-500">KRW</span>
                    </div>
                </div>
            ) : null}
            {kind === "phone" ? (
                <div className="flex rounded-md shadow-sm">
                    <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none text-sm">
                        +82
                    </span>
                    <input
                        id={name}
                        required={required}
                        {...register}
                        type={type}
                        className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md rounded-l-none shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
            ) : null}
            {kind === "rank" ? (
                <div className="rounded-md relative flex  items-center shadow-sm">
                    <input
                        id={name}
                        required={required}
                        {...register}
                        type={type}
                        min={0}
                        className="appearance-none w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
            ) : null}
            {kind === "file" ? (
                <div className="hidden">
                    <input
                        id={name}
                        required={required}
                        {...register}
                        type={type}
                        min={0}
                        onChange={filelabelchange}
                        accept=".xlsx, .xls, .csv"
                        className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>
            ) : null}
            {kind === "salefind" ? (
                <div className="">
                    <input
                        id={name}
                        required={required}
                        {...register}
                        type={type}
                        onChange={filelabelchange}
                        className="outline-0 border-b-2"
                    />
                </div>
            ) : null}
        </div>
    )
}
export default Input