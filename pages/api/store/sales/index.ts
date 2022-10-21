import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";
import { stringify } from "querystring";

// /api/store/sales 현재 링크
// pages/sales 에서 GET 요청중
// pages/sales 에서 POST 요청중
const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const { session: { user } } = req;
    const profile = await client.user.findUnique({ where: { id: user?.id }, select: { kind: { select: { rank: true } } } });
    const rank = profile?.kind?.rank || 0
    if (req.method == "POST") {
        const { storeId, startDate, endDate, saleType, brand } = req.body;
        let startTemp, endTemp

        if (startDate && endDate) {
            startTemp = new Date(startDate);
            endTemp = new Date(endDate);
        } else if (startDate) {
            startTemp = new Date(startDate);
            endTemp = new Date(startDate)
            const getday = endTemp.getDate();
            endTemp.setDate(getday + 7);
        } else if (endDate) {
            endTemp = new Date(endDate);
            startTemp = new Date(endDate)
            const getday = startTemp.getDate();
            startTemp.setDate(getday - 7);
        } else {
            endTemp = new Date();
            startTemp = new Date(endTemp)
            const getday = startTemp.getDate();
            startTemp.setDate(getday - 7);
        }
        try {
            const store = await client.store.findUnique({
                where: { id: +storeId },
                select: { products: { include: { sales: true } } }
            });
            const saleList = await client.saleList.findMany({
                where: {
                    storeId: +storeId,
                    createAt: { gte: startTemp, lt: endTemp },
                    kind: saleType,
                }, include: { sales: { include: { product: true } }, user: { select: { userIdentity: true } } }
            });
            return res.json({ ok: true, store, saleList })
        } catch (error) {
            return res.json({ ok: false })
        }
    }
    if (req.method == "GET") {
        if (rank >= 90) {
            const stores = await client.store.findMany({ include: { products: true } })
            return res.json({ ok: true, stores })
        } else {
            const stores = await client.store.findMany({ where: { kind: { equals: profile?.kind?.rank } }, include: { products: true } })
            return res.json({ ok: true, stores })
        }
    }
}
export default withApiSession(withHandler({ methods: ["GET", "POST"], handler, isPrivate: false }));
