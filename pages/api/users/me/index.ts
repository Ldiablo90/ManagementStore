import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHanler, { ResponseType } from "@libs/server/withHandler";
import withApiSession from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    if (req.method == "GET") {
        const { session: { user } } = req;
        const profile = await client.user.findUnique({
            where: { id: user?.id },
            select: {
                id: true,
                userIdentity: true,
                kind: {
                    select: {
                        rank: true,
                        rankName: true
                    }
                }
            }
        })
        if (profile) { return res.json({ ok: true, profile }) }
        return res.json({ ok: false })
    }
    if (req.method === "POST") {
        console.log("Post")
        // const {session:{user}, body:{email,phone, name,avaterId}} = req;
        // const currentUser = await client.user.findUnique({where:{id:user?.id}})
        // if(name && name !== currentUser?.name){

        //     await client.user.update({where:{id:user?.id},data:{name}})
        //     return res.json({ok:true})
        // }
        // if(email && email !== currentUser?.email){
        //     const alreadyExists = Boolean(await client.user.findUnique({
        //         where:{email},select:{id:true}
        //     }))
        //     if(alreadyExists){ console.log(alreadyExists); return res.json({ok:false,error:"Email already taken."})}
        //     await client.user.update({where:{id:user?.id},data:{email}})
        //     return res.json({ok:true})
        // }
        // if(phone && phone !== currentUser?.phone){
        //     const alreadyExists = Boolean(await client.user.findUnique({
        //         where:{phone},select:{id:true}
        //     }))
        //     if(alreadyExists){ return res.json({ok:false,error:"Phone already taken."})}
        //     await client.user.update({where:{id:user?.id},data:{phone: `${phone}`}})
        //     return res.json({ok:true})
        // }
        // if(avaterId){ await client.user.update({where:{id:user?.id},data:{avatar:avaterId}})}
        return res.json({ ok: false, error: "수정된 정보가 없습니다." })
    }
}
export default withApiSession(withHanler({ methods: ["GET", "POST"], handler, isPrivate: false }));