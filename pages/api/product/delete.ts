import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const { session: { user }, body:{id} } = req;
    const itemId = id? +id:0
    if(itemId > 0){
        const item = await client.product.findFirst({where:{id:itemId}})
        await client.product.delete({where:{id:itemId}})
        await client.allLog.create({data:{log:`상품삭제 / 상품명 :${item?.brand} ${item?.title} ${item?.option} 수량 : ${item?.quantity} `}})
        return res.json({ok:true})
    }
    res.json({ok:false})
    
}
export default withApiSession(withHandler({ methods: ["POST"], handler, isPrivate: false }));
