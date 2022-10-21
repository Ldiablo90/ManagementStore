import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const ranks = await client.userKind.findMany({include:{_count:{select:{users:true}}}});
    res.json({ok:true,ranks});
}
export default withApiSession(withHandler({ methods: ["GET"], handler}));
