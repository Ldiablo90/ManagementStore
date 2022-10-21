import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const { session: { user }, query: { id } } = req;
  const userId = id? +id: -1
  if (req.method === "POST") {
    const profile = await client.user.findUnique({ where: { id: user?.id }, select: { userIdentity:true,kind: { select: { rank: true } } } })
    const rank = profile?.kind?.rank ? profile?.kind?.rank : 0
    if (profile && rank > 90) {

      const { newRank, newRankName } = req.body;
      const origin = await client.userKind.findUnique({where:{id:userId},select:{rank:true,rankName:true}});
      if (newRank && newRankName){
        await client.userKind.update({ where: { id: userId }, data: { rank: +newRank, rankName:newRankName } });
      }
      else if(newRank){
        await client.userKind.update({ where: { id: userId }, data: { rank: +newRank }});
      }
      else if(newRankName){
        await client.userKind.update({ where: { id: userId }, data: { rankName:newRankName } });
      }
      await client.allLog.create({data:{log:`등급변경 / 랭크 : ${origin?.rank} = ${newRank} / 랭크이름 : ${origin?.rankName} = ${newRankName} 변경실행유저 : ${profile.userIdentity}`}})
      res.json({ ok: true })
    } else {
      res.json({ ok: false })
    }
  }
  else if (req.method === "GET") {
    const rankName = await client.userKind.findUnique({ where: { id: userId }, select: { rank:true, rankName: true } })
    res.json({ ok: true, rankName })
  }
}
export default withApiSession(withHandler({ methods: ["GET", "POST"], handler, isPrivate: false }));
