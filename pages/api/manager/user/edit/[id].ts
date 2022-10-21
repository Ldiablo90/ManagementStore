import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const { session: { user }, query: { id } } = req;
    const userId = id ? +id : -1
    if (req.method === "POST") {
        const profile = await client.user.findUnique({ where: { id: user?.id }, include: { kind: { select: { rank: true } } } })
        const rank = profile?.kind?.rank || 0
        if (profile && rank > 90) {
            const { userIdentity, kind } = req.body;
            const origin = await client.user.findUnique({ where: { id: userId }, select: { userIdentity: true, kind:{select:{id:true}} } });
            if (userIdentity && kind) {
                await client.user.update({ where: { id: userId }, data: { userIdentity, kind: { connect: { id: +kind } } } })
            }
            else if (userIdentity) {
                await client.user.update({ where: { id: userId }, data: { userIdentity } })
            }
            else if (kind) {
                await client.user.update({ where: { id: userId }, data: { kind: { connect: { id: +kind } } } })
            }
            await client.allLog.create({data:{log:`유저변경 / 아이디 : ${origin?.userIdentity} = ${userIdentity} / 등급ID : ${origin?.kind?.id} = ${kind}`}})
            res.json({ ok: true })
        }
        else {
            res.json({ ok: false })
        }
    }
    else if (req.method === "GET") {
        const user = await client.user.findUnique({ where: { id: userId }, include: { kind: { select: { id: true, rankName: true } } } })
        res.json({ ok: true, user })
    }
}
export default withApiSession(withHandler({ methods: ["GET", "POST"], handler, isPrivate: false }));
