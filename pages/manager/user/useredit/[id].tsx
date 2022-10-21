import Button from '@components/button';
import Input from '@components/input';
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import { User, UserKind } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr';

interface UserEditForm {
    userIdentity: String;
    kind: number;
}
interface UserWidthKind extends User {
    kind: { id: number, rankName: String }

}
interface UserSelectRespones {
    ok: boolean;
    user: UserWidthKind;
}
interface KindRespones {
    ok: boolean;
    ranks: UserKind[]
}

interface UserEditRespones {
    ok: boolean;
}
function UserEdit() {
    const router = useRouter();
    const { data: userData } = useSWR<UserSelectRespones>(router.query.id ? `/api/manager/user/edit/${router.query.id}` : null)
    const { data: kindData } = useSWR<KindRespones>("/api/manager/kind");

    const [userEditFnc, { loading, data: editData }] = useMutation<UserEditRespones>(`/api/manager/user/edit/${router.query.id}`)
    const { register, handleSubmit, setValue } = useForm<UserEditForm>();
    const onValid = ({ userIdentity, kind }: UserEditForm) => {
        if (loading) return;
        if (userIdentity == userData?.user.userIdentity && kind == userData?.user.kind.id) { return; }
        else if (userIdentity == userData?.user.userIdentity) { userEditFnc({ kind }) }
        else if (kind == userData?.user.kind.id) { userEditFnc({ userIdentity }) }
        else { userEditFnc({ userIdentity, kind }) }
    }

    useEffect(() => {
        if (userData && userData.ok) {
            setValue("userIdentity", userData?.user?.userIdentity);
            setValue("kind", userData.user.kind.id);
        }
    }, [userData, setValue])
    useEffect(() => {
        if (editData && editData.ok) { router.back() }
    }, [editData, router])


    const backPage = () => { router.back() }
    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <div className='text-3xl mb-3'>유저 변경</div>
                <form onSubmit={handleSubmit(onValid)}>
                    <Input register={register("userIdentity")} type="text" name='' label='아이디' kind='text' />
                    <select className='w-full py-3 my-5 bg-blue-200 rounded-md outline-none' {...register("kind")}>
                        <option value={0}>등급 선택</option>
                        {kindData?.ranks.map(kind => (
                            <option value={kind.id} key={kind.id}>{kind.rankName}</option>
                        ))}
                    </select>
                    <Button kind='form' label={loading ? "로딩중" : "유저 변경"} link='' />
                </form>
            </Warrper>
            <Button kind='back' label='뒤로가기' link='' />
        </div>
    )
}

export default UserEdit