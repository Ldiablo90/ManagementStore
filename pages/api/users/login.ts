import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
  const { userIdentity, password } = req.body;
  const user = await client.user.findFirst({ where: { userIdentity, password } });
  if (!user) {return res.json({ ok:false })}
  // 로그인 로그
  await client.allLog.create({data:{log:`유저로그인 / ${user.userIdentity} `}})
  req.session.user = { id: user?.id };
  await req.session.save()
  res.json({ ok: true });
}
export default withApiSession(withHandler({ methods: ["POST"], handler, isPrivate: false }));
