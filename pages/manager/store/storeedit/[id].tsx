import Button from '@components/button';
import Input from '@components/input';
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import { Store } from '@prisma/client';
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

interface ManagerStoreForm {
    kind: number;
    title: string;
    name: string;
}

interface ManagerStoreEditRespones {
    ok: boolean;
    store: Store;
}
interface ManagerStoreFormRespones {
    ok: boolean;
}


function ManagerStoreEdit() {
    const router = useRouter();
    const { data: storeData, error } = useSWR<ManagerStoreEditRespones>(router.query.id ? `/api/manager/store/storeedit/${router.query.id}` : null);
    const { register: storeRegister, handleSubmit, setValue } = useForm<ManagerStoreForm>();
    const [storeEdit, { loading, data: formData }] = useMutation<ManagerStoreFormRespones>(`/api/manager/store/storeedit/${router.query.id}`)
    const onValid = ({ kind, title, name }: ManagerStoreForm) => {
        if (loading) return;
        if (!kind || !title || !name) return;

        if (kind != storeData?.store.kind && title === storeData?.store.title && name === storeData?.store.name) { storeEdit({ kind }) }
        else if (kind == storeData?.store.kind && title !== storeData?.store.title && name === storeData?.store.name) { storeEdit({ title }) }
        else if (kind == storeData?.store.kind && title === storeData?.store.title && name !== storeData?.store.name) { storeEdit({ name }) }
        else if (kind != storeData?.store.kind && title !== storeData?.store.title && name === storeData?.store.name) { storeEdit({ kind, title }) }
        else if (kind == storeData?.store.kind && title !== storeData?.store.title && name !== storeData?.store.name) { storeEdit({ name, title }) }
        else if (kind != storeData?.store.kind && title === storeData?.store.title && name !== storeData?.store.name) { storeEdit({ name, kind }) }
        else { storeEdit({ kind, title, name }) }
    }
    useEffect(() => {
        if (formData && formData.ok) { router.back() };
    }, [formData, router])
    useEffect(() => {
        if (storeData && storeData.ok) {
            setValue("kind", storeData.store?.kind);
            setValue("title", storeData.store?.title);
            setValue("name", storeData.store?.name);
        }
    }, [storeData, setValue])

    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <div className='text-3xl mb-3'>
                    <h2>상점 변경하기</h2>
                </div>
                <form onSubmit={handleSubmit(onValid)}>
                    <div className='my-4'>
                        <Input label='상점 등급' name='storeRank' type='number' register={storeRegister("kind", { min: 0 })} kind='rank' />
                        <Input label='상점 분류' name='stoerTitle' type='text' register={storeRegister("title")} />
                        <Input label='상점 이름' name='stoerName' type='text' register={storeRegister("name")} />
                    </div>
                    <Button kind='form' label={loading ? '로딩중...' : '상점 정보 변경'} link='' />
                </form>
            </Warrper>
            <Button kind='back' label='뒤로가기' link='' />
        </div>
    )
}

export default ManagerStoreEdit