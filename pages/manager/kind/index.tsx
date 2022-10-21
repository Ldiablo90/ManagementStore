import Button from '@components/button';
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import { UserKind } from '@prisma/client';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import useSWR, { useSWRConfig } from 'swr'

interface KindWidthCountUser extends UserKind {
    _count:{users:number}
}

interface KindPageRespone {
    ok: boolean;
    ranks: KindWidthCountUser[];
}
interface kindDeleteForm {
    id: number;
}
function KindPage() {
    const { data } = useSWR<KindPageRespone>("/api/manager/kind");
    const checked = useRef(0);
    const selectKind = (id: number) => { checked.current = id; };

    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <div className='text-3xl mb-3'>
                    <h2>슈케이브 관리자 리스트</h2>
                </div>
                <div className='w-full'>
                    <div className='flex flex-row bg-blue-200 py-3 mb-2 rounded-md'>
                        <div className='flex-1 text-center'>관리자 ID</div>
                        <div className='flex-1 text-center'>관리자 이름</div>
                        <div className='flex-1 text-center'>등록된 유저</div>
                    </div>
                    {data?.ranks?.map(rank => (
                        <div className='flex flex-row relative odd:border-y py-1' key={rank.id}>
                            <input className='translate-y--1/2 absolute inset-y-1 left-2 peer' type="radio" name='kind' id={rank.rankName} value={rank.id} onClick={() => selectKind(rank.id)}/>
                            <label className='flex flex-row flex-1 hover:bg-teal-600 hover:text-white rounded-md peer-checked:bg-teal-600 peer-checked:text-white' htmlFor={rank.rankName}>
                                <div className='flex-1 text-center'>{rank.rank}</div>
                                <div className='flex-1 text-center'>{rank.rankName}</div>
                                <div className='flex-1 text-center'>{rank._count.users}</div>
                            </label>
                        </div>
                    ))}
                </div>
            </Warrper>
            <Warrper kind='button'>
                <Button kind='add' label='추가' link='/manager/kind/add' />
                <Button kind='remove' label='삭제' link='/api/manager/kind/delete' selectitem={checked} />
                <Button kind='edit' label='변경' link='/manager/kind/edit' selectitem={checked} />
            </Warrper>
        </div>
    )
}

export default KindPage