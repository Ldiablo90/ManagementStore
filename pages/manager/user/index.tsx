import Button from '@components/button';
import Layout from '@components/layout'
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import { onlyDate } from '@libs/client/utiles';
import { User, UserKind } from '@prisma/client';
import React, { useRef, useState } from 'react'
import useSWR from 'swr'

interface UserWithKind extends User {
    kind: { rankName: string; }
}

interface ManagerUserRespones {
    ok: boolean;
    users: UserWithKind[];
}


function ManagerUser() {
    const { data } = useSWR<ManagerUserRespones>("/api/manager/user")
    const checked = useRef(0);
    const selectUser = (id: number) => { checked.current = id };

    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <div className='text-3xl mb-3'>
                    <h2>유저 리스트</h2>
                </div>
                <div className='flex flex-row bg-blue-200 py-3 mb-2 rounded-md'>
                    <div className='flex-1 text-center'>관리자 이름</div>
                    <div className='flex-1 text-center'>유저이름</div>
                    <div className='flex-1 text-center'>생성날자</div>
                    <div className='flex-1 text-center'>마지막업테이트날자</div>
                </div>
                {data?.users?.map(user =>(
                    <div className='flex flex-row border-b-2 my-1 relative' key={user.id}>
                        <input className='translate-y--1/2 absolute inset-y-1 left-2 peer' id={user.userIdentity} type="radio" name='kind' value={user.id} onClick={() => selectUser(user.id)} />
                        <label className='flex flex-row flex-1 hover:bg-teal-600 hover:text-white rounded-md peer-checked:bg-teal-600 peer-checked:text-white' htmlFor={user.userIdentity}>
                            <div className='flex-1 text-center'>{user.userIdentity}</div>
                            <div className='flex-1 text-center'>{user.kind?.rankName ? user.kind.rankName : "등급 미정"}</div>
                            <div className='flex-1 text-center'>{onlyDate(user.createAt)}</div>
                            <div className='flex-1 text-center'>{onlyDate(user.updateAt)}</div>
                        </label>
                    </div>
                ))}
            </Warrper>
            <Warrper kind='button'>
                <Button kind='add' label='유저추가' link='/manager/user/useradd' />
                <Button kind='remove' label='유저삭제' link='/api/manager/user/delete' selectitem={checked} />
                <Button kind='edit' label='유저변경' link='/manager/user/useredit' selectitem={checked} />
            </Warrper>
        </div>
    )
}

export default ManagerUser