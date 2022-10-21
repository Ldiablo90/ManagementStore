import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session"{
    interface IronSessionData{
        user?:{
            id:number;
        }
    }
}
const cookieOptions = {
    cookieName: "shoecavecusecookie",
    password: `${process.env.COOKIE_PASSWORD}`
}

const withApiSession = (fn:any)=>withIronSessionApiRoute(fn,cookieOptions)


export default withApiSession