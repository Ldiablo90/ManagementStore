import Button from '@components/button';
import Warrper from '@components/warrper';
import { onlyDate } from '@libs/client/utiles';
import { Store, User, UserKind } from '@prisma/client';
import React, { useRef, useState } from 'react'
import useSWR from 'swr'

interface StoreWithProducts extends Store {
    _count: {
        products: number;
    }
}
interface ManagerStoerRespones {
    ok: boolean;
    stores: StoreWithProducts[];
}

function ManagerStore() {
    const { data } = useSWR<ManagerStoerRespones>("/api/manager/store")
    const checked = useRef(0);
    const selectStoer = (id: number) => { checked.current = id };

    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <div className='text-3xl mb-3'>
                    <h2>스토어 리스트</h2>
                </div>
                <div className='flex flex-row bg-blue-200 py-3 mb-2 rounded-md'>
                    <div className='flex-1 text-center'>등급</div>
                    <div className='flex-1 text-center'>위치</div>
                    <div className='flex-1 text-center'>상품갯수</div>
                    <div className='flex-1 text-center'>생성날자</div>
                </div>
                {data?.stores?.map(store => (
                    <div className='flex flex-row border-b-2 relative' key={store.id}>
                        <input className='translate-y--1/2 absolute inset-y-1 left-2 peer' id={store.name + store.kind} type="radio" name='kind' value={store.id} onClick={() => selectStoer(store.id)} />
                        <label className='flex flex-row flex-1 hover:bg-teal-600 hover:text-white rounded-md peer-checked:bg-teal-600 peer-checked:text-white' htmlFor={store.name + store.kind}>
                            <div className='flex-1 text-center'>{store.kind}</div>
                            <div className='flex-1 text-center'>{`${store.title} ${store.name}`}</div>
                            <div className='flex-1 text-center'>{store._count.products}</div>
                            <div className='flex-1 text-center'>{onlyDate(store.createAt)}</div>
                        </label>
                    </div>
                ))}
            </Warrper>
            <Warrper kind='button'>
                <Button kind="add" label='상점추가' link='/manager/store/storeadd' />
                <Button kind='remove' label='상점삭제' link='/api/manager/store/storedel' selectitem={checked} />
                <Button kind='edit' label='상점변경' link='/manager/store/storeedit' selectitem={checked} />
            </Warrper>
        </div>
    )
}

export default ManagerStore