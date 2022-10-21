import Button from '@components/button';
import Input from '@components/input';
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import { Product, Store } from '@prisma/client';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr';

interface ProductEditForm {
    store: number;
    brand: String;
    title: String;
    option: String;
    quantity: number;
    saveQuantity: number;
    temp?: String;
    storeId: number;
    price: number;
}
interface StoreRespones {
    ok: boolean;
    stores: Store[];
}
interface ProductRespones {
    ok: boolean;
    product: Product;
}
interface ProductEditRespones {
    ok: boolean;
}

function ProductEdit() {
    const router = useRouter();
    const { data: storeData } = useSWR<StoreRespones>("/api/store");
    const { data: productData } = useSWR<ProductRespones>(router.query?.id ? `/api/product/${router.query?.id}` : null)
    const { register, handleSubmit, setValue } = useForm<ProductEditForm>();
    const [ProductEditfnc, { loading, data: addData }] = useMutation<ProductEditRespones>(`/api/product/${router.query.id}`)
    const onValid = ({ store, brand, title, option, quantity, saveQuantity, price, temp }: ProductEditForm) => {
        if (loading) return;
        if (store === productData?.product.storeId &&
            brand === productData?.product.brand &&
            title === productData?.product.title &&
            option === productData?.product.option &&
            quantity == productData?.product.quantity &&
            saveQuantity == productData?.product.saveQuantity &&
            price == productData?.product.price) return;
        ProductEditfnc({ store, brand, title, option, quantity, saveQuantity, price, temp });
    }
    useEffect(() => {
        if (addData && addData.ok) { router.back(); }
    }, [addData, router])
    useEffect(() => {
        if (productData) {
            setValue("store", productData.product.storeId)
            setValue("brand", productData.product.brand);
            setValue("title", productData.product.title);
            setValue("option", productData.product.option);
            setValue("quantity", productData.product.quantity);
            setValue("saveQuantity", productData.product.saveQuantity);
            setValue("price", productData.product.price);
        }
    }, [productData, setValue])


    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <div className='text-3xl mb-3'>상품 변경</div>
                <form onSubmit={handleSubmit(onValid)}>
                    <select className='rounded-md relative flex border border-gray-300 items-center border w-full px-3 py-2' {...register("store")}>
                        <option value={0}>상점선택</option>
                        {storeData?.stores?.map(store => (
                            <option value={store.id} key={`${store.title}${store.id}`}>{`${store.title} ${store.name}`}</option>
                        ))}
                    </select>
                    <Input register={register("brand", { required: true })} label="브랜드" type='text' required={true} name="productbrand" />
                    <Input register={register("title", { required: true })} label="상품이름" type='text' required={true} name="producttitle" />
                    <Input register={register("option", { required: true })} label="상품옵션" type='text' required={true} name="productoption" />
                    <Input register={register("quantity", { required: true, min: 0 })} label="상품수량" type='number' required={true} name="productquantity" />
                    <Input register={register("saveQuantity", { required: true, min: 0 })} label="상품안전수량" type='number' required={true} name="productsaveQuantity" />
                    <Input register={register("price", { required: true, min: 0 })} label="가격" type='number' required={true} name="productsaveQuantity" />
                    <Input register={register("temp")} label="비고" type='text' name="producttemp" />
                    <Button kind='form' label={loading ? "로딩중..." : "상품저장"} link='' />
                </form>
            </Warrper>
            <Button kind='back' label='뒤로가기' link='' />
        </div>
    )
}

export default ProductEdit