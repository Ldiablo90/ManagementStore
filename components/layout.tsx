import useMutation from '@libs/client/useMutation';
import useUser from '@libs/client/useUser';
import { cls } from '@libs/client/utiles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Button from './button';

interface LayoutPropos {
    children: React.ReactNode;
}

function Layout({ children }: LayoutPropos) {
    const router = useRouter();
    const [menuClick, setMenuClick] = useState(false);
    const { user } = useUser();
    const [manager, setManager] = useState<boolean>(false);
    useEffect(() => {
        if(user?.kind && user?.kind?.rank > 90){
            setManager(true)
        }else{
            setManager(false)
        }
      console.log("Layout");
    }, [user])
    
    if (router.pathname === "/login") {
        return (<div className='flex flex-row h-full'>{children}</div>)
    } else {
        return (
            <div className='flex flex-row h-full p-3 bg-slate-400'>
                <div className='px-5 flex-1 max-w-full overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300'>{children}</div>
                <div className={cls('flex flex-col justify-center items-center gap-1 bg-blue-200 w-14 h-14 rounded-full fixed transition-all ease-linear duration-500 inset-x-1/2 z-50',menuClick? 'bottom-10':'-bottom-1/2')} onClick={()=>setMenuClick(!menuClick)}>
                    <div className='bg-blue-500 w-8 h-1 rounded-full'></div>
                    <div className='bg-blue-500 w-8 h-1 rounded-full'></div>
                    <div className='bg-blue-500 w-8 h-1 rounded-full'></div>
                </div>

                <div className={cls('bg-blue-200 fixed  left-1/2 -translate-x-1/2 -tru rounded-t-xl w-full transition-all ease-linear duration-300 py-16',!menuClick? "bottom-0":"-bottom-full")} onClick={()=>setMenuClick(!menuClick)}>
                    <div className='flex flex-col justify-center items-center text-xl gap-4'>
                        <div><Link href={"/"}><a className='text-green-700 hover:bg-green-300 px-16 rounded-full'>홈</a></Link></div>
                        {manager ? (
                            <>
                                <div><Link href={"/manager/kind"}><a className='text-green-700 hover:bg-green-300 px-16 rounded-full'>유저등급 생성 및 수정,삭제</a></Link></div>
                                <div ><Link href={"/manager/user"}><a className='text-green-700 hover:bg-green-300 px-16 rounded-full'>유저 생성 및 수정,삭제</a></Link></div>
                                <div ><Link href={"/manager/store"}><a className='text-green-700 hover:bg-green-300 px-16 rounded-full'>스토어 생성 및 수정,삭제</a></Link></div>
                            </>
                        ) : null}
                        <div ><Link href={"/store"}><a className='text-green-700 hover:bg-green-300 px-16 rounded-full'>나의 상점</a></Link></div>
                        <div><Link href={"/sales"}><a className='text-green-700 hover:bg-green-300 px-16 rounded-full'>판매 관리</a></Link></div>
                        <Button kind='logout' label='로그아웃' link='/api/users/logout' />
                    </div>
                </div>
                
            </div>
        )
    }
}

export default Layout