import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";
import { stringify } from "querystring";
import { SaleKind } from "@prisma/client";

interface fileProps {
    kind:string;
    productId:string;
    brand:string;
    title:string;
    option:string;
    quantity:string;
}

// 링크 /api/store/sales/fileupload
// pages/sales/add/[id] 에서 파일업로드 사용하는 함수
// pages/store에서 상품입고하는 함수
const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const { session: { user }, query:{id}, body:{file} } = req;
    const storeId = id? +id : 0
    const uploadFile = file instanceof Array? file:[]
    const profile = await client.user.findUnique({where:{id:user?.id},include:{kind:{select:{rank:true}}}})
    const userrank = profile?.kind?.rank? profile?.kind?.rank : 0
    // 스토어아이디가 있으며 받은 파일에 정보가 있으면 실행
    if(storeId > 0 && uploadFile.length > 0){
        const store = await client.store.findUnique({where:{id:storeId}});
        // 데이터 유효성검사 
        if(!uploadFile[0].kind || !uploadFile[0].quantity) return;
        // 사용자에게 스토어가 연결되어있는지와 관리자인지 확인
        if(userrank == store?.kind || userrank > 90){
            // 등록 종류 뽑기
            const kinds = uploadFile.map((v:fileProps)=>v.kind).filter((v:string,i:number,a:string[])=>a.indexOf(v) == i);
            // 등록별로 인서트
            kinds.map(async (kind:string)=>{
                //등록종류
                const salekind = kind==="판매"?"sale":kind==="구매"?"buy":"cancel";

                const saleList = await client.saleList.create({
                    data:{
                        kind:salekind,
                        store:{connect:{id:storeId}},
                        user:{connect:{id:user?.id}},
                        temp:''
                    }
                });
                // 등록된 종류에 따라 데이터 분류하기
                const useData = uploadFile.filter((data:fileProps)=>data.kind === kind)
                useData.map(async (data:fileProps)=>{
                    await client.sale.create({
                        data:{
                            kind:salekind,
                            saleList:{connect:{id:saleList.id}},
                            product:{connect:{id:+data.productId}},
                            quantity:+data.quantity,
                        }
                    })
                    await client.product.update({
                        where:{id:+data.productId},
                        data:{
                            quantity: salekind === "buy" ? { increment: +data.quantity } : salekind === "sale" ? { decrement: +data.quantity } : {decrement:0}
                        }
                    })
                });
                await client.allLog.create({data:{log:`${kind} 등록 / 유저아이디 : ${user?.id} 등로개수 ${useData.length}`}})
            });
            return res.json({ok:false, temp:"저장이 완료되었습니다."})
        }else{return res.json({ok:false, temp:'권한이 없는 요청입니다.'})}
    };
    res.json({ok:false, temp:'테스트중입니다.'})
}
export default withApiSession(withHandler({ methods: ["POST"], handler, isPrivate: false }));
