import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";

interface filetypes {
    brand:string;
    title:string;
    option:string;
    quantity:number;
    saveQuantity:number;
    temp:string;
}
// 링크 /api/store/fileupload 
// pages/store 에서 다중 상품 만드는 핸들러
const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const { session: { user }, body:{file, storeId} } = req;
    const uploadFile = file instanceof Array? file:[]
    if(uploadFile && uploadFile.length > 0){
        if(!uploadFile[0].brand || !uploadFile[0].title || !uploadFile[0].option){
            return res.json({ok:false, temp:"파일을 확인해주세요."})
        }
        uploadFile.map(async (data:filetypes)=>{
            await client.product.create({
                data:{
                    store:{connect:{id:+storeId}},
                    brand:data.brand,
                    title:data.title,
                    option:data.option,
                    quantity:+data.quantity,
                    saveQuantity:+data.saveQuantity,
                    temp:data.temp || "",
                    user:{connect:{id:user?.id}}
                }
            })
        })
        await client.allLog.create({
            data:{log:`파일로 상품생성- 유저아이디 : ${user?.id}`}
        })
        return res.json({ok:true,temp:"파일이 생성되었습니다."})
    }else{return res.json({ok:false,temp:"알맞은 파일이 아닙니다."})}
    
    
}
export default withApiSession(withHandler({ methods: ["POST"], handler, isPrivate: false }));
