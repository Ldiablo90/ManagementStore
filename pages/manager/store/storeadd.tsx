import Button from '@components/button';
import Input from '@components/input';
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import { UserKind } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr';

interface StoreAddForm {
    title: String;
    name: String;
    kind: number;
}

interface StoreAddRespones {
    ok: boolean;
}
function ManagerStoreAdd() {

    const { register, handleSubmit, setValue } = useForm<StoreAddForm>();

    const [storeAddfnc, { loading, data }] = useMutation<StoreAddRespones>("/api/manager/store/storeadd");

    const onValid = ({ title, name, kind }: StoreAddForm) => {
        console.log(title, name, kind)
        if (loading) return;
        storeAddfnc({ title, name, kind });
    }
    const router = useRouter();
    const backPage = () => { router.back() }
    useEffect(() => {
        if (data && data.ok) { router.back(); }
        setValue("kind", 0)
    }, [data, router, setValue])

    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <div className='text-3xl mb-3'>
                    <h2>상점 생성하기</h2>
                </div>
                <form onSubmit={handleSubmit(onValid)}>
                    <div className='mb-2'>
                        <Input
                            register={register("title", { required: true })} type="text" name='storetitle' label='분류' required />
                        <Input
                            register={register("name", { required: true })} type="text" name='storename' label='상점이름' required />
                        <Input
                            register={register("kind", { required: true, min: 0 })} type="number" name='storekind' label='상점등급' required kind='rank'/>
                    </div>
                    <Button kind='form' label={loading ? '로딩중...' : '상점 저장'} link='' />
                </form>
            </Warrper>
            <Button kind='back' label='뒤로가기' link='' />
        </div>
    )
}

export default ManagerStoreAdd