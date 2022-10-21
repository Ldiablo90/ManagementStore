import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHanler, { ResponseType } from "@libs/server/withHandler";
import withApiSession from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const { session: { user }, query:{id} } = req;
    const storeId = id? +id : 0
    if (req.method === "GET") {
        const profile = await client.user.findUnique({ where: { id: user?.id }, include:{kind:{select:{rank:true}}}})
        const rank = profile?.kind?.rank || 0
        const store = await client.store.findUnique({where:{id:storeId}})

        if (profile && rank > 90) {
            return res.json({ ok: true, store })
        } else {
            return res.json({ ok: false })
        }
    }
    if (req.method === "POST") {
        const {body:{kind,title,name}} = req;
        const profile = await client.user.findUnique({ where: { id: user?.id }, include:{kind:{select:{rank:true}}}})
        const rank = profile?.kind?.rank || 0
        if (!kind && !title && !name) return res.json({ok:false})

        if (profile && rank > 90) {
            console.log(kind,title,name)
            if(kind && !title && !name) await client.store.update({where:{id:storeId},data:{kind:+kind}});
            else if(!kind && title && !name) await client.store.update({where:{id:storeId},data:{title}})
            else if(!kind && !title && name) await client.store.update({where:{id:storeId},data:{name}})
            else if(kind && title && !name) await client.store.update({where:{id:storeId},data:{kind:+kind,title}})
            else if(!kind && title && name) await client.store.update({where:{id:storeId},data:{title,name}})
            else if(kind && !title && name) await client.store.update({where:{id:storeId},data:{kind:+kind,name}})
            else await client.store.update({where:{id:storeId},data:{kind:+kind,title,name}})
            return res.json({ ok: true })
        } else {
            return res.json({ ok: false })
        }
    }
}
export default withApiSession(withHanler({ methods: ["GET", "POST"], handler }));