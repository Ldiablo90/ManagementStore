import Input from "@components/input";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Warrper from "@components/warrper";

interface LoginForm {
    userIdentity: String;
    password: String;
}
interface LoginRespons {
    ok: boolean;
}

const Login = () => {
    const { register, handleSubmit } = useForm<LoginForm>();
    const [answord, setAnsword] = useState("")
    const [Loginfnc, { loading, data }] = useMutation<LoginRespons>("/api/users/login");
    const onValid = ({ userIdentity, password }: LoginForm) => {
        if(loading)return;
        Loginfnc({ userIdentity, password });
    }
    const router = useRouter();
    useEffect(() => {
        if (data && data.ok) { console.log("why /login/index"); router.push("/"); }
        else if (data && !data.ok) { setAnsword("아이디 혹은 비밀번호를 확인해주세요.") }
    }, [data, router])

    return (
        <div className="flex justify-center items-center w-full h-full bg-slate-100">
            <Warrper kind="login">
                <form onSubmit={handleSubmit(onValid)}>
                    <div className="">
                        <Input label="ID" type="text" name="userIdentity" kind="text" register={register("userIdentity")} />
                        <Input label="PW" type="password" name="password" kind="text" register={register("password")} />
                    </div>
                    <div className="text-orange-600 text-center">{answord}</div>
                    <button disabled={loading ? true:false} >{loading ? "Lodding..." : "Login"}</button>
                </form>
            </Warrper>
        </div>
    )
}

export default Login