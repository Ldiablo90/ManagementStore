import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const { session: { user } } = req;

    const profile = await client.user.findUnique({ where: { id: user?.id }, select: { kind: { select: { rank: true } } } });
    const rank = profile?.kind?.rank || 0
    if (rank >= 90){
        const stores = await client.store.findMany({include:{products:true}})
        return res.json({ok:true,stores})
    }else{
        const stores = await client.store.findMany({where:{ kind:{equals:profile?.kind?.rank}},include:{products:true}})
        return res.json({ok:true,stores})
    }
}
export default withApiSession(withHandler({ methods: ["GET"], handler, isPrivate: false }));
