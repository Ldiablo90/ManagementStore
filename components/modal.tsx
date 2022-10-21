import { cls } from '@libs/client/utiles';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

interface ModalProps {
    visivility: string;
    tempText:string;
    setVisi:Dispatch<SetStateAction<boolean>>;
}

function Modal({visivility, tempText, setVisi}:ModalProps) {
    
    const modalClose = ()=>{
        console.log(setVisi)
    }
    useEffect(() => {
    }, [visivility])
    
    return (
        <div id='modal' className={cls('flex flex-col items-center bg-white rounded-xl w-96 py-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  shadow-md shadow-stone-600',`${visivility}`) }>
            <div>{tempText}</div>
            <div>
                <div className='bg-black rounded-full text-white text-center w-36' onClick={modalClose}>확인</div>
            </div>
        </div>
    )
}

export default Modal