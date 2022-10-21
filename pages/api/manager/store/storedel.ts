import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const { session: { user } } = req;
  const profile = await client.user.findUnique({ where: { id: user?.id }, include: { kind: { select: { rank: true } } } })
  const rank = profile?.kind?.rank || 0
  if (profile && rank > 90) {
    const { id } = req.body;
    await client.store.delete({ where: { id: id } })
    res.json({ ok: true })
  } else {
    res.json({ ok: false })
  }
}
export default withApiSession(withHandler({ methods: ["POST"], handler, isPrivate: false }));
