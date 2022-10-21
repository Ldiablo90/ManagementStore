import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHanler, { ResponseType } from "@libs/server/withHandler";
import withApiSession from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    if (req.method === "GET") {
        const { session: { user } } = req;
        const profile = await client.user.findUnique({ where: { id: user?.id }, include:{kind:{select:{rank:true}}}})
        const rank = profile?.kind?.rank || 0
        if (profile && rank > 90) {
            const users = await client.user.findMany({
                select: {
                    id: true,
                    userIdentity: true,
                    kind: { select: { rankName: true } },
                    createAt: true,
                    updateAt: true,

                }
            })
            return res.json({ ok: true, users })
        } else {
            return res.json({ ok: false })
        }
    }
    if (req.method === "POST") {
        console.log("Post")

        return res.json({ ok: false, error: "수정된 정보가 없습니다." })
    }
}
export default withApiSession(withHanler({ methods: ["GET", "POST"], handler }));