import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const { session: { user }, query: { id }, } = req;
    const productId = id ? +id : 0
    if (req.method === "POST") {
        const { store, brand, title, option, quantity, saveQuantity,price, temp } = req.body;
        if (productId > 0) {
            await client.product.update({
                where: { id: productId },
                data: {
                    store: { connect: { id: store } },
                    brand,
                    title,
                    option: option,
                    quantity: +quantity,
                    saveQuantity: +saveQuantity,
                    price:+price,
                    temp,
                }
            })
            await client.allLog.create({data:{log:`상품 수정 / 유저 아이디 ${user?.id} / 상품 아이디 : ${productId}`}})
            res.json({ ok: true })
        }
        res.json({ ok: false })

    }
    else if (req.method === "GET") {
        if (productId < 0) return res.json({ ok: false })
        const product = await client.product.findUnique({ where: { id: productId } })
        res.json({ ok: true, product })
    }
}
export default withApiSession(withHandler({ methods: ["GET", "POST"], handler, isPrivate: false }));
