import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";
import { SaleKind } from "@prisma/client";

interface itemListType {
    storeName: string;
    product: string;
    quantity: number;
    productId?:number;
}
// /api/store/sale/[id] 현 링크
// pages/sales/[id] 에서 GET 핸들러
// pages/sales/add/[id] 에서 POST 핸들러
const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const { session: { user }, query: { id } } = req;
    const profile = await client.user.findUnique({ where: { id: user?.id }, select: { id: true, kind: { select: { rank: true } } } });
    const rank = profile?.kind?.rank || 0
    const storeId = id ? +id : 0
    if (!storeId) return res.json({ ok: false })
    if (req.method == "POST") {
        const { itemList, itemKind, itemTemp } = req.body;

        const items = await client.store.findUnique({
            where: { id: storeId },
            select: { products: { select: { id:true } } }
        })
        const saleList = await client.saleList.create({
            data: {
                kind: itemKind,
                temp: itemTemp,
                user: { connect: { id: user?.id } },
                store: { connect: { id: storeId } }
            }
        });
        itemList.map(async (item: itemListType) => {
            await client.sale.create({
                data: {
                    kind: itemKind,
                    product: { connect: { id: +item.product.split("/")[0] } },
                    quantity: +item.quantity,
                    saleList: { connect: { id: saleList.id } },
                }
            })
            await client.product.update({
                where: { id: +item.product.split("/")[0] },
                data: { quantity: itemKind === "buy" ? { increment: +item.quantity } : itemKind === "sale" ? { decrement: +item.quantity } : {decrement: 0} }
            })
        })
        await client.allLog.create({ data: { log: `${itemKind}가 등록되었습니다. 사용자 : ${profile?.id} / 판매리스트아이디 : ${saleList.id}` } })
        res.json({ ok: true })
    }
    if (req.method == "GET") {
        const getStore = await client.store.findUnique({ where: { id: storeId }, include: { products: true } })
        if (getStore?.kind == rank || rank >= 90) {
            return res.json({ ok: true, getStore })
        }
        res.json({ ok: false })
    }
}
export default withApiSession(withHandler({ methods: ["GET", "POST"], handler, isPrivate: false }));
