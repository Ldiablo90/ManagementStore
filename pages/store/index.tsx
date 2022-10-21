import Button from '@components/button';
import Warrper from '@components/warrper';
import { cls, koTime, onlyDate } from '@libs/client/utiles';
import { Product, Store } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

interface MyStoreWithProducts extends Store {
    products: Product[]
}

interface MyStoresRespones {
    ok: boolean;
    stores: MyStoreWithProducts[];
}

function MyStores() {
    const { data: storeData } = useSWR<MyStoresRespones>("/api/store");
    const [useStore, setUseStore] = useState<MyStoreWithProducts>()
    const checked = useRef(0);
    const storeId = useRef(0);
    const [modalVisivility, setModalVisivility] = useState(false)

    const selectStore = (index: number, storeid: number) => { 
        setUseStore(storeData?.stores[index]); 
        storeId.current = storeid 
    };
    const selectProduct = (id: number) => { checked.current = id };
    useEffect(() => {
        if (storeData && storeData?.ok) {
            setUseStore(storeData?.stores[0]);
            storeId.current = storeData.stores[0].id;
        }
    }, [storeData, storeId])

    return (
        <div className='flex flex-col gap-4 relative'>
            <Warrper>
                <div className='text-3xl mb-3'>STORES</div>
                <div className='flex flex-row gap-4'>
                    {storeData?.stores?.map((store, i) => (
                        <div onClick={() => selectStore(i, store.id)} className='border-2 rounded-md px-3 py-1 cursor-pointer' key={store.id}>{`${store.title} ${store.name}`}</div>
                    ))}
                </div>
            </Warrper>
            <Warrper>
                <div className='text-3xl mb-3'>상점 정보</div>
                <div className='flex flex-row bg-blue-200 py-3 mb-2 rounded-md'>
                    <div className='flex-1 text-center'>등급</div>
                    <div className='flex-1 text-center'>이름</div>
                    <div className='flex-1 text-center'>상품갯수</div>
                    <div className='flex-1 text-center'>만든날자</div>
                </div>
                <div className='flex flex-row'>
                    <div className='flex-1 text-center'>{useStore?.kind}</div>
                    <div className='flex-1 text-center'>{`${useStore?.title} ${useStore?.name}`}</div>
                    <div className='flex-1 text-center'>{useStore?.products.length}</div>
                    <div className='flex-1 text-center'>{useStore?.createAt ? koTime(useStore?.createAt) : ""}</div>
                </div>
            </Warrper>
            <Warrper>
                <div className='text-3xl mb-3'>상품정보</div>
                <div className='my-3'>
                    <div className='flex flex-row bg-blue-200 py-3 mb-2 rounded-md'>
                        <div className='flex-1 text-center'>상품일련번호</div>
                        <div className='flex-1 text-center'>브랜드</div>
                        <div className='flex-1 text-center'>상품이름</div>
                        <div className='flex-1 text-center'>상품옵션</div>
                        <div className='flex-1 text-center'>수량</div>
                        <div className='flex-1 text-center'>가격</div>
                    </div>
                    {useStore?.products && useStore?.products?.length > 0 ?
                        useStore.products.map(product => (
                            <div className='border-b-2 my-1 relative' key={product.id}>
                                <input className='translate-y--1/2 absolute inset-y-1 left-2 peer' id={`${product.brand}${product.id}`} type="radio" name='kind' value={product.id} onClick={() => selectProduct(product.id)} />
                                <label className='flex flex-row flex-1 hover:bg-teal-600 hover:text-white rounded-md peer-checked:bg-teal-600 peer-checked:text-white' htmlFor={`${product.brand}${product.id}`}>
                                    <div className='flex-1 text-center'>{product.id}</div>
                                    <div className='flex-1 text-center'>{product.brand}</div>
                                    <div className='flex-1 text-center'>{product.title}</div>
                                    <div className='flex-1 text-center'>{product.option}</div>
                                    <div className={cls('flex-1 text-center',product.saveQuantity > product.quantity?"text-red-200":"text-blue-300")}>{product.quantity}</div>
                                    <div className='flex-1 text-center'>{product.price}</div>
                                </label>
                            </div>
                        )) : <div className='flex-1 text-center'>등록된 상품이 없습니다.</div>}
                </div>
                <Warrper kind='button'>
                    <Button kind='add' label='상품추가' link='/products/add' />
                    <Button kind='remove' label='상품삭제' link='/api/product/delete' selectitem={checked} />
                    <Button kind='edit' label='상품변경' link='/products/edit' selectitem={checked} />
                </Warrper>
            </Warrper>
            <Button kind='file' label='상품 입고  파일' link={`/api/store/sales/fileupload/${storeId.current}`}/>
            <Button kind='file' label='상품 등록 파일' link={`/api/store/fileupload`} storeId={storeId} />
        </div>
    )
}

export default MyStores