import React from 'react'
interface LayoutPropos {
    kind?: "base" | "button" | "login";
    children: React.ReactNode;
}
function Warrper({ kind = "base", children }: LayoutPropos) {
    return (
        <div className='w-full'>
            {kind === "base" ?
                <section className='overflow-hidden flex flex-col bg-white rounded-xl p-5 w-full border-4 border-blue-300 border-double '>{children}</section>
                : null}
            {kind === "button"?
                <section className='w-full h-12 flex flex-row justify-between gap-28'>{children}</section>
            :null}
            {kind === "login"?
                <section className='bg-white  rounded-xl border-4 border-blue-300 border-double p-5 max-w-xl m-auto'>{children}</section>
            :null}
        </div>
    )
}
export default Warrper