import Button from '@components/button';
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import { cls } from '@libs/client/utiles';
import { Product, Store } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import useSWR from 'swr'
import * as XLSX from 'ts-xlsx';

interface StoreWithProducts extends Store {
    products: Product[];
}

interface StoreRespones {
    ok: boolean;
    getStore: StoreWithProducts;
}

interface SaleItem {
    storeName: string;
    product: string;
    price: number;
    quantity: number;
}
interface StoreSaleListRespones {
    ok: boolean;
}
interface StoreSaleNaver {
    ok: boolean;
}
interface StoreSaleListAddUploadRespones {
    ok: boolean;
    temp: string;
}

function StoreSaleListAdd() {
    const router = useRouter();
    const { data: storeData } = useSWR<StoreRespones>(router.query.id ? `/api/store/sales/${router.query.id}` : null);
    const [itemListTemp, setitemListTemp] = useState<SaleItem[]>([]);
    const [itemQuantity, setItemQuantity] = useState<number>(0);
    const [itemProduct, setItemProduct] = useState<string>("");
    const [itemKind, setItemKind] = useState<string>("sale")
    const [storeName, setstoreName] = useState<string>("")
    const [itemTemp, setItemTemp] = useState<string>("")
    const [itemPrice, setItemPrice] = useState<number>(0)
    const saleItem = useRef<SaleItem>();
    const [modalText, setmodalText] = useState("")
    const [modalVisivility, setModalVisivility] = useState(false)

    const { handleSubmit: handleSubmitM, } = useForm();
    const [saleListAddFnc, { loading, data }] = useMutation<StoreSaleListRespones>(`/api/store/sales/${router.query.id}`);

    const onValidM = () => {
        if (loading) return;
        saleListAddFnc({ itemList: itemListTemp, itemKind, itemTemp });
        setitemListTemp([]);
        setItemKind("sale");
        setItemTemp("");
    }

    const addItemFnc = () => {
        if (!itemProduct || !itemQuantity) {
            setModalVisivility(true);
            setmodalText("추가할 상품정보를 입력하세요.")
            return
        };
        saleItem.current = { storeName: storeName, product: itemProduct, quantity: itemQuantity, price: itemPrice }
        setitemListTemp([...itemListTemp, saleItem.current])
        setItemProduct("")
        setItemQuantity(0)
    }
    const itemRemove = (index: number) => {
        setitemListTemp(itemListTemp.filter((_, i) => i != index))
    }

    const directItemSelect = (val: ChangeEvent<HTMLSelectElement>) => {
        const targetindex = val.target.options.selectedIndex;
        setItemProduct(val.target.value);
        const price = storeData?.getStore?.products[targetindex - 1]?.price ? +storeData?.getStore?.products[targetindex - 1].price : 0
        setItemPrice(price)

    }
    useEffect(() => {
        if (data && data.ok) { router.back() }
    }, [data, router])
    useEffect(() => {
        if (storeData && storeData.ok) { setstoreName(`${storeData?.getStore.title} ${storeData?.getStore.name}`) }
    }, [storeData])

    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <select className='w-full text-xl outline-none' value={itemKind} onChange={e => setItemKind(e.target.value)}>
                    <option value="sale">매출</option>
                    <option value="buy">매입</option>
                    <option value="cancel">취소</option>
                </select>
            </Warrper>
            <form className='flex flex-col gap-4' onSubmit={handleSubmitM(onValidM)}>
                {itemListTemp.length > 0 ? (
                    <Warrper>
                        <div className='flex flex-row bg-blue-200 py-3 mb-2 rounded-md'>
                            <div className='flex-1 text-center'>상점이름</div>
                            <div className='flex-1 text-center'>상품</div>
                            <div className='flex-1 text-center'>가격</div>
                            <div className='flex-1 text-center'>상품개수</div>
                            <div className='flex-1 text-center'>총금액</div>
                        </div>
                        {itemListTemp.map((v, i) => (
                            <div className='border-b-2 pb-4' key={`${i}`}>
                                <div className='flex flex-row'>
                                    <div className='flex-1 text-center'>{storeName}</div>
                                    <div className='flex-1 text-center'>{v.product.split('/')[1]}</div>
                                    <div className='flex-1 text-center'>{v.price}</div>
                                    <div className='flex-1 text-center'>{v.quantity}</div>
                                    <div className='flex-1 text-center'>{v.price * v.quantity}</div>
                                </div>
                                <div className='w-full bg-red-300 rounded-xl text-center py-1 my- 1' onClick={() => itemRemove(i)}>삭제</div>
                            </div>
                        ))}
                        <div className='flex flex-col items-end pr-5'>
                            <div className='text-xl'>상품 총 합계</div>
                            <div className='text-lg text-bold'>{itemListTemp.map(v => (v.price * v.quantity)).reduce((ori, curr) => ori + curr)}</div>
                        </div>
                        <textarea className="mt-1 shadow-sm w-full rounded-md border border-gray-300 resize-none" value={itemTemp} onChange={e => setItemTemp(e.target.value)} placeholder="상세정보" />
                        <Button kind='form' label='등록' link='' />

                    </Warrper>
                ) : null}
            </form>
            <Warrper>
                <div className='flex flex-row bg-blue-200 py-3 mb-2 rounded-md'>
                    <div className='flex-1 text-center'>상점이름</div>
                    <div className='flex-1 text-center'>상품</div>
                    <div className='flex-1 text-center'>상품개수</div>
                    <div className='flex-1 text-center'>가격</div>
                </div>
                <div className='flex flex-col '>
                    <div className='flex flex-row my-1'>
                        <div className='flex-1 text-center'>{storeName}</div>
                        <div className='flex-1 text-center'>
                            <select className='text-center border outline-none rounded-lg' value={itemProduct} onChange={e => directItemSelect(e)}>
                                <option value="">상품을 선택하세요.</option>
                                {storeData?.getStore?.products.map(product => (
                                    <option value={`${product.id}/${product.brand} ${product.title} ${product.option}`} key={product.id}>{`${product.brand} ${product.title} ${product.option}`}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex-1 flex flex-col justify-center'>
                            <input className='text-center border outline-none rounded-lg' type="number" value={itemQuantity} min={0} onChange={e => setItemQuantity(+e.target.value)} />
                        </div>
                        <div className='flex-1 text-center'>
                            {itemPrice}
                        </div>
                    </div>
                    <div className='flex-1 text-center cursor-pointer bg-lime-200 py-1 mt-3 rounded-full shadow-md shadow-stone-600 my-2 active:shadow-inner' onClick={addItemFnc}>
                        개별 추가
                    </div>
                </div>
            </Warrper>
            <Button kind='file' label='상품 출고 및 취소 파일' link={`/api/store/sales/fileupload/${router.query.id}`} />

            <Button kind='back' label='뒤로가기' link='' />
            <div id='modal' className={cls('flex flex-col items-center bg-white rounded-xl w-96 py-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  shadow-md shadow-stone-600 transition-all', modalVisivility ? 'opacity-100' : 'opacity-0 hidden')}>
                <div>{modalText}</div>
                <div className='bg-black rounded-full text-white text-center w-36' onClick={() => setModalVisivility(false)}>
                    확인
                </div>
            </div>
        </div>
    )
}

export default StoreSaleListAdd