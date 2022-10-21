import { NextApiRequest, NextApiResponse } from "next"
import client from "@libs/server/client"
import withHandler, { ResponseType } from "@libs/server/withHandler"
import withApiSession from "@libs/server/withSession";

// 현링크 /api/users/logout
const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseType>) => {
    const {session:{ user }} = req;
    console.log("logout");
    if(user?.id){
        req.session.destroy();
        res.json({ok:true,temp:"로그아웃 되었습니다."})
    }else{
        res.json({ok:true,temp:"로그아웃에 실패되었습니다."})
    }
}
export default withApiSession(withHandler({ methods: ["POST"], handler, isPrivate: false }));
