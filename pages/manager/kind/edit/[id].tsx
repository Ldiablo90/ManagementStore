import Button from '@components/button';
import Input from '@components/input';
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import { UserKind } from '@prisma/client';
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';
import useSWR from 'swr';

interface KindEditerForm {
    newRank: number;
    newRankName: String;
}
interface kindDetailRespones {
    ok: boolean;
    rankName: UserKind;
}
interface KindEditRespones {
    ok: boolean;
}
function KindEditer() {
    const router = useRouter();
    const { data: kindData } = useSWR<kindDetailRespones>(router.query.id ? `/api/manager/kind/edit/${router.query.id}` : null) // GET
    const [editKind, { loading, data }] = useMutation<KindEditRespones>(`/api/manager/kind/edit/${router.query.id}`) // POST
    const { register, handleSubmit, setValue } = useForm<KindEditerForm>();
    const onValid = ({ newRank, newRankName }: KindEditerForm) => {
        if (loading) return;
        if (newRankName && newRankName === kindData?.rankName.rankName && newRank == kindData?.rankName.rank) { return; }
        else if (newRankName && newRankName === kindData?.rankName.rankName) { editKind({ newRank }) }
        else if (newRank == kindData?.rankName.rank) { editKind({ newRankName }) }
        else { editKind({ newRank, newRankName }) }
    }
    const pageBack = () => { router.back(); }
    useEffect(() => {
        if (kindData && kindData.rankName) {
            setValue("newRank", kindData.rankName.rank);
            setValue("newRankName", kindData.rankName.rankName);
        }
    }, [kindData, setValue])
    useEffect(() => {
        if (data && data.ok) { router.back(); }
    }, [data, router])

    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <form className='' onSubmit={handleSubmit(onValid)}>
                    <div className='text-3xl mb-3'>관리자 변경</div>
                    <div className='my-5'>
                        <Input register={register("newRank")} type="number" name='newRank' label='관리자 ID' />
                        <Input register={register("newRankName")} type="text" name='newRankName' label='관리자 이름' />
                    </div>
                    <Button kind='form' label={loading ? "Lodding..." : "변경"} link="" />
                </form>

            </Warrper>
            <Button kind="back" label='뒤로가기' link='' />
        </div>
    )
}

export default KindEditer  