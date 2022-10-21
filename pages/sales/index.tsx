import Button from '@components/button';
import Input from '@components/input';
import Warrper from '@components/warrper';
import useMutation from '@libs/client/useMutation';
import { koTime, localeString, onlyDate } from '@libs/client/utiles';
import { Product, Sale, SaleList, Store } from '@prisma/client';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import useSWR from 'swr';

interface StoreFindForm {
    storeId: number;
    startDate: string;
    endDate: string;
    saleType: string;
}

interface StoreSalesRespones {
    ok: boolean;
    stores: Store[];
}
interface SaleWithProduct extends Sale {
    product: Product;
}
interface SaleListWithSale extends SaleList {
    sales: SaleWithProduct[];
    user: { userIdentity: string; }
}
interface ProductsWithSales extends Product {
    sales: Sale[];
}
interface FindStoreRespone {
    ok: boolean;
    store: { products: ProductsWithSales[] };
    saleList: SaleListWithSale[];
}

function SalesPage() {
    const { data: storeData } = useSWR<StoreSalesRespones>("/api/store/sales");
    const [dataControllText, setDataControllText] = useState("데이터를 검색해 주세요...")
    const { register: registerF, handleSubmit: handleSubmitF, getValues: getValuesF, watch: watchF, setValue: setValueF } = useForm<StoreFindForm>();

    const [findStore, { loading: loadingStoreFind, data: findData }] = useMutation<FindStoreRespone>("/api/store/sales");

    const onValidF = ({ storeId, startDate, endDate, saleType }: StoreFindForm) => {
        if (loadingStoreFind) return;
        if (storeId == 0) return;
        findStore({ storeId, startDate, endDate, saleType })
    }
    useEffect(() => {
        setValueF("storeId", 0)
        setValueF("saleType", "sale")
    }, [storeData, setValueF])
    useEffect(() => {
        if (findData && findData.ok) {
            if (findData.saleList.length < 1) {
                setDataControllText("검색할 데이터가 없습니다.")
            } else {
                console.log(findData.saleList.map((sellist:SaleListWithSale)=> [koTime(sellist.createAt),sellist.createAt])[0])
            }
        }
    }, [findData])

    return (
        <div className='flex flex-col gap-4'>
            <Warrper>
                <div className='text-3xl mb-3'>판매 / 매출 관리</div>
                <form className='flex flex-col gap-4 flex-wrap' onSubmit={handleSubmitF(onValidF)}>
                    <div className='flex flex-row gap-4'>
                        <select className='outline-0 border-b-2' {...registerF("storeId")}>
                            <option value={0}>스토어선택</option>
                            {storeData?.stores?.map(store => (
                                <option value={store.id} key={`${store.title}${store.id}`}>{`${store.title} ${store.name}`}</option>
                            ))}
                        </select>
                        <Input kind="salefind" type='date' label='시작날짜' name='startdate' register={registerF("startDate")} />
                        <Input kind="salefind" type='date' label='종료날짜' name='startdate' register={registerF("endDate")} />
                        <select className='outline-0 border-b-2' {...registerF("saleType")}>
                            <option value={"sale"}>판매</option>
                            <option value={"buy"}>입고</option>
                            <option value={"cancel"}>취소</option>
                        </select>
                    </div>
                    <Button kind='form' label={loadingStoreFind ? "로딩중" : '검색'} link='' />
                </form>
            </Warrper>
            {findData?.saleList!!?.length > 0 ?
                <Warrper>
                    <div className='flex flex-row justify-between items-end mb-3 ml-3'>
                        <div className='text-3xl'>판매 현황</div>
                        <div className=''>엑셀파일로 저장</div>
                    </div>
                    <div className='flex flex-col overflow-auto  h-96 scrollbar-thin scrollbar-thumb-blue-300'>
                        <table className='table-fixed mx-5 mb-10 border-spacing-4'>
                            <thead>
                                <tr className=''>
                                    <td className='whitespace-nowrap text-center bg-blue-200  rounded-l-md'>일시</td>
                                    <td className='whitespace-nowrap text-center px-4 py-3 bg-blue-200'>분류</td>
                                    {/* <td className='whitespace-nowrap text-center px-4 bg-blue-200'>생성유저</td> */}
                                    {
                                        findData?.saleList?.map(saleList => saleList.sales).map(sales => sales.filter(sale => sale.quantity > 0)).reduce((prev, curr) => prev?.concat(curr))?.filter((v, i, arr) => arr.findIndex((v2, j) => v.productId === v2.productId) === i).map(sale => (
                                            <td className='px-4 whitespace-nowrap text-center bg-blue-200' key={sale.id}>{`${sale.product.brand} ${sale.product.title} ${sale.product.option}`}</td>
                                        ))
                                    }
                                    <td className='whitespace-nowrap text-center px-4 bg-blue-200 rounded-r-md'>총계</td>
                                </tr>
                            </thead>
                            <tbody>
                                {findData?.saleList?.map(saleList => (
                                    <tr className='border-b-2' key={saleList.id}>
                                        <td className='whitespace-nowrap text-center' >{koTime(saleList.createAt)}</td>
                                        <td className='whitespace-nowrap text-center' >{saleList.kind === "sale" ? "판매" : saleList.kind === "buy" ? "입고" : "취소"}</td>
                                        {/* <td className='whitespace-nowrap text-center' >{saleList.user?.userIdentity}</td> */}

                                        {
                                            findData?.saleList?.map(saleList => saleList.sales).map(sales => sales.filter(sale => sale.quantity > 0)).reduce((prev, curr) => prev?.concat(curr))?.filter((v, i, arr) => arr.findIndex((v2, j) => v.productId === v2.productId) === i).map((inv: SaleWithProduct) => saleList.sales.filter((outv: SaleWithProduct) => outv.productId == inv.productId)).map((tdd: SaleWithProduct[], i) => (
                                                <td className='whitespace-nowrap text-center' key={`${i}${tdd[0]?.id}`}>
                                                    {tdd[0]?.quantity || 0}개<br/>
                                                    {localeString(tdd[0]?.quantity * tdd[0]?.product?.price || 0) }원
                                                </td>
                                            ))
                                        }
                                        <td className='whitespace-nowrap text-center' >{localeString(saleList.sales.map(sale => sale.quantity * sale.product.price).reduce((prev, curr) => prev + curr))}원</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className='whitespace-nowrap text-center' colSpan={2} >누계</td>
                                    {
                                        findData?.saleList.map(saleList => saleList.sales).map(sales => sales.filter(sale => sale.quantity > 0)).reduce((prev, curr) => prev.concat(curr)).filter((v, i, arr) => arr.findIndex((v2, j) => v.productId === v2.productId) === i).map(sale => (
                                            <td className='whitespace-nowrap text-center' key={sale.id}>
                                                {
                                                    localeString(findData?.saleList.map(saleList => saleList.sales).map(sales => sales.filter(sale => sale.quantity > 0)).reduce((prev, curr) => prev.concat(curr)).filter(v => sale.productId == v.productId).map(v => v.quantity * v.product.price).reduce((prev, curr) => prev + curr))
                                                }원
                                            </td>
                                        ))
                                    }
                                    <td className='whitespace-nowrap text-center' >
                                        {
                                            localeString(findData?.saleList.map(saleList => saleList.sales).map(sales => sales.map(sale => sale.quantity * sale.product.price).reduce((prev, curr) => prev + curr)).reduce((prev, curr) => prev + curr) || 0)
                                        }원
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Warrper>
                : <Warrper>{dataControllText}</Warrper>
            }
            <div className='flex flex-row gap-2'>
                {watchF("storeId") != 0 ?
                    <div className='w-full h-12 flex flex-row justify-between gap-28'>
                        <Button kind='add' label='판매등록' link={`/sales/add/${getValuesF("storeId")}`} />
                    </div>
                    : null}
            </div>
        </div>
    )
}

export default SalesPage