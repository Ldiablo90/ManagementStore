import Button from '@components/button';
import Input from '@components/input';
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import { UserKind } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr';

interface UserAddForm {
    userIdentity: String;
    password: String;
    kind: number;
}
interface KindRespones {
    ok: boolean;
    ranks: UserKind[]
}
interface UserAddRespones {
    ok: boolean;
}

function UserAdd() {
    const { data: kindData } = useSWR<KindRespones>("/api/manager/kind");
    const { register, handleSubmit } = useForm<UserAddForm>();
    const [userAddMove, { loading, data }] = useMutation<UserAddRespones>("/api/manager/user/useradd");
    const onValid = ({ userIdentity, password, kind }: UserAddForm) => {
        console.log(userIdentity, password, kind)
        if (loading) return;
        if (kind != 0) { userAddMove({ userIdentity, password, kind }); console.log("kind") }
        else { userAddMove({ userIdentity, password }); console.log("not kind") }
    }
    const router = useRouter();
    const backPage = () => { router.back() }
    useEffect(() => {
        if (data && data.ok) { router.back(); }
    }, [data, router])

    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <div className='text-3xl mb-3'>
                    <h2>유저 생성하기</h2>
                </div>
                <form onSubmit={handleSubmit(onValid)}>
                    <div>
                        <Input
                            register={register("userIdentity", { required: true })} type="text" name='userIdentity' label='유저 아이디' required />
                        <Input
                            register={register("password", { required: true })} type="text" name='password' label='유저 비밀번호' required />
                        <select className='w-full py-2 my-5 bg-blue-200 rounded-md outline-none' {...register("kind")}>
                            <option value={0}>등급선택</option>
                            {kindData?.ranks.map(kind => (
                                <option value={kind.id} key={kind.id}>{kind.rankName}</option>
                            ))}
                        </select>
                    </div>
                    <Button kind='form' label={loading?'로딩중...':'유저 저장'} link='' />
                </form>
            </Warrper>
            <Button kind='back' label='뒤로가기' link='' />
        </div>
    )
}

export default UserAdd