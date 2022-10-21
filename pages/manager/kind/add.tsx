import Button from '@components/button';
import Input from '@components/input';
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

interface kindAddRespones {
    ok: boolean;
}

interface kindAddRegister {
    rank: number;
    rankName: String;
}

function KindAdd() {
    const [kindadd, { loading, data }] = useMutation<kindAddRespones>("/api/manager/kind/add") // POST
    const { register, handleSubmit, setValue } = useForm<kindAddRegister>();
    const onValid = ({ rank, rankName }: kindAddRegister) => {
        if (loading) return;
        kindadd({ rank, rankName })
    }
    const router = useRouter();
    const backPage = () => { router.back() }

    useEffect(() => {
        if (data && data.ok) { router.push("/kind") }
        setValue("rank", 0)
    }, [data, router, setValue])

    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <form className='' onSubmit={handleSubmit(onValid)}>
                    <div className='text-3xl mb-3'>관리자 추가</div>
                    <div className='my-5'>
                        <Input register={register("rank", { required: true })} label='관리자 ID' kind='text' type='number' name='rank' required />
                        <Input register={register("rankName", { required: true })} label='관리자 이름' kind='text' type='text' name='rankName' required />
                    </div>
                    <Button kind='form' label={loading ? "Lodding..." : "추가"} link="" />
                </form>
            </Warrper>
            <Button kind="back" label='뒤로가기' link='' />
        </div>
    )
}

export default KindAdd