import useMutation from '@libs/client/useMutation';
import { cls } from '@libs/client/utiles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import * as XLSX from 'ts-xlsx';

interface ButtonProps {
    label: string;
    kind: "add" | "remove" | "edit" | "back" | "form" | "file" | "logout";
    storeId?: React.MutableRefObject<number>;
    selectitem?: React.MutableRefObject<number>;
    link: string;
}
interface FileUploadRespones{
    ok: boolean;
    temp: string;
}

function Button({ label, kind, selectitem, link, storeId }: ButtonProps) {
    const router = useRouter();
    // 택스트 정하기
    const [labelText, setLabelText] = useState("")
    useEffect(() => {
        if (label) { setLabelText(label); }
    }, [label])
    // 모달 State
    const [modalText, setmodalText] = useState("입력이필요한 api")
    const [modalVisivility, setModalVisivility] = useState(false)

    // POST로 정보를 주고받을경우
    const [buttonFnc, { loading, data }] = useMutation<FileUploadRespones>(kind === "remove" || kind === "file" || kind === "logout" ? link : "");

    // 삭제 확인 State
    const [delChack, setDelChack] = useState(false);
    // 삭제 버튼 
    const DeleteButton = () => {
        if (loading) return; // 로딩중이면 실행안댐
        if (!selectitem?.current) { // 선택된숫자가 없으면 실행안댐
            setmodalText("항목을 선택해 주세요.")
            setModalVisivility(true)
            return;
        }
        setDelChack(!delChack) // 삭제확인버튼으로 바꾸기
        if (!delChack) return;
        buttonFnc({ id: selectitem?.current })
        router.reload();
    }
    // 상품 수정 버튼
    const editButton = () => {
        if (!selectitem?.current) {
            setmodalText("항목을 선택해 주세요.");
            setModalVisivility(true);
            return;
        }
        router.push(`${link}/${selectitem?.current}`)
    }
    // 로그아웃 버튼
    const logoutButton = ()=>{
        if (loading) return; // 로딩중이면 실행안댐
        buttonFnc({})
    }
    const okClick=()=>{
        setModalVisivility(false);
        if(kind === "logout"){
            router.replace("/login");
        }
    }
    // 뒤로가기
    const backButton = () => { router.back() }

    // useEffect
    useEffect(() => {
        if (data) {
            if(data.ok && kind === "logout"){
                if(!modalVisivility){router.replace('/login');}
            }
            setModalVisivility(true);
            setmodalText(data.temp);
        }else{setModalVisivility(false);}
    }, [data, modalVisivility])

    // 파일 상품입고 업로드
    const uploadCilck = (event: ChangeEvent<HTMLInputElement>) => {
        console.log("움직였나?")
        const reader = new FileReader();
        reader.onload = async (v) => {
            const data = v.target?.result;
            let readData = XLSX.read(data, { type: "binary" });
            const wsname = readData.SheetNames[0];
            const ws = readData.Sheets[wsname];
            const dataParse: object[] = await XLSX.utils.sheet_to_json(ws, { header: 0 });
            if (dataParse.length < 1 || (dataParse.length > 1 && Object.keys(dataParse[0]).length > 15 && dataParse.length > 80)) {
                setModalVisivility(true);
                setmodalText("파일 크기가 너무 크거나 인식이 안되는 파일입니다.")
                return;
            }
            buttonFnc({ file: dataParse, storeId: storeId?.current });
        }
        if (event.target.files && event.target.files.length > 0) {
            if (loading) return;
            reader.readAsBinaryString(event.target.files[0]);
        }
    }
    
    return (
        <div className='flex flex-1'>
            {kind === "add" ? (
                <div className='flex-1 h-full '>
                    <Link href={link}><a className='h-full bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md shadow-stone-500 active:shadow-inner'>{labelText}</a></Link>
                </div>
            ) : null}
            {kind === "remove" ? (
                <div className={cls("flex-1 h-full rounded-full flex items-center justify-center shadow-md shadow-stone-500 active:shadow-inner", delChack ? "bg-red-300 cursor-pointer " : loading ? "cursor-wait" : "bg-white border-2 cursor-pointer")} onClick={DeleteButton}>
                    <button className='w-full h-full'>{delChack ? "삭제 확인" : loading ? "로딩중..." : labelText}</button>
                </div>
            ) : null}
            {kind === "edit" ? (
                <div className='flex-1 h-full bg-gray-400 text-white rounded-full flex items-center justify-center cursor-pointer shadow-md shadow-stone-500 active:shadow-inner' onClick={editButton}>
                    {labelText}
                </div>
            ) : null}
            {kind === "back" ? (
                <div className='flex-1 h-full bg-yellow-100 rounded-full text-center cursor-pointer py-3 shadow-md shadow-stone-500 active:shadow-inner' onClick={backButton}>
                    {labelText}
                </div>
            ) : null}
            {kind === "form" ? (
                <button className='bg-blue-300 text-white rounded-full text-center cursor-pointer py-3 m-1 w-full shadow-md shadow-stone-500 active:shadow-inner'>{labelText}</button>
            ) : null}
            {kind === "file" ? (
                <label className='flex-1 px-3 py-2 text-center bg-green-400 rounded-full shadow-md shadow-stone-600 cursor-pointer active:shadow-inner'>
                    <input className='hidden' type="file" accept=".xlsx, .xls, .csv" onChange={uploadCilck} disabled={loading} />{loading ? "로딩중..." : `${labelText}`}
                </label>
            ) : null}
            {kind === "logout"?(
                <div className='cursor-pointer text-green-700 hover:bg-green-300' onClick={logoutButton}>{labelText}</div>
            ):null}
            <div id='modal' className={cls('flex flex-col items-center bg-white rounded-xl p-5 border-4 border-blue-300 border-double fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  shadow-md shadow-stone-600 transition-all', modalVisivility ? 'opacity-100' : 'opacity-0 hidden')}>
                <div>{modalText}</div>
                <div className='bg-black rounded-full text-white text-center w-36 cursor-pointer' onClick={okClick}>
                    확인
                </div>
            </div>
        </div>
    )
}

export default Button