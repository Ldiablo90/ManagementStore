import Button from '@components/button';
import Input from '@components/input';
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import { Store } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr';

interface ProductAddForm {
    store: number;
    brand: String;
    title: String;
    option: String;
    quantity: number;
    saveQuantity: number;
    price: number;
    temp?: String;
    storeId: number;
}
interface StoreRespones {
    ok: boolean;
    stores: Store[];
}
interface ProductAddRespones {
    ok: boolean;
}

function ProductAdd() {
    const { data: storeData } = useSWR<StoreRespones>("/api/store");
    const { register, handleSubmit, setValue } = useForm<ProductAddForm>();
    const [productAddfnc, { loading, data: addData }] = useMutation<ProductAddRespones>("/api/product/add")
    const onValid = (form: ProductAddForm) => {
        if (loading) return;
        if (!+form.store) return;
        productAddfnc(form);
    }
    const router = useRouter();
    useEffect(() => {
        setValue("quantity", 0);
        setValue("saveQuantity", 0);
        if (addData && addData.ok) { router.back(); }
    }, [addData, router, setValue])

    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <div className='text-3xl mb-3'>상품 추가</div>
                <form onSubmit={handleSubmit(onValid)}>
                    <select className='rounded-md relative flex  items-center border w-full px-3 py-2 focus:ring-orange-500 focus:outline-none focus:border-orange-500"' {...register("store")}>
                        <option value={0}>상점선택</option>
                        {storeData?.stores?.map(store => (
                            <option value={store.id} key={`${store.title}${store.id}`}>{`${store.title} ${store.name}`}</option>
                        ))}
                    </select>
                    <Input register={register("brand", { required: true })} label="브랜드" type='text' required={true} name="productbrand" />
                    <Input register={register("title", { required: true })} label="상품이름" type='text' required={true} name="producttitle" />
                    <Input register={register("option", { required: true })} label="상품옵션" type='text' required={true} name="productoption" />
                    <Input register={register("quantity", { min: 0 })} label="상품수량" type='number' required={true} name="productquantity" />
                    <Input register={register("saveQuantity", { min: 0 })} label="상품안전수량" type='number' required={true} name="productsaveQuantity" />
                    <Input register={register("saveQuantity", { min: 0 })} label="가격" type='number' required={true} name="productsaveQuantity" />
                    <Input register={register("temp")} label="비고" type='text' name="producttemp" />
                    <Button kind='form' label={loading ? "로딩중..." : "상품저장"} link='' />
                </form>
            </Warrper>
            <Button kind='back' label='뒤로가기' link='' />
        </div>
    )
}

export default ProductAdd