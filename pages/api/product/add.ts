import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";



const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const { session: { user }, body:{store,brand,title,option,quantity,saveQuantity,price,temp} } = req;
    const userId = user?.id || 0
    if(!userId){return res.json({ok:false})}
    await client.product.create({
        data:{
            brand,
            title,
            option,
            temp,
            quantity: +quantity,
            saveQuantity: +saveQuantity,
            price:+price,
            store:{connect:{id:+store}},
            user:{connect:{id:userId}}
        }
    })
    res.json({ok:true})
}
export default withApiSession(withHandler({ methods: ["POST"], handler, isPrivate: false }));
