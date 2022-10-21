import { NextApiRequest, NextApiResponse } from "next"

export interface ResponseType {
    ok: boolean,
    [key: string] : any,
}
type method =  "GET" | "POST" | "DELETE";
interface ConfigType {
    methods: method[], 
    handler:(req: NextApiRequest, res: NextApiResponse)=> void, 
    isPrivate?:boolean,
}

const withHandler = ({methods, isPrivate = true, handler }: ConfigType) => {
    return async (req: NextApiRequest, res: NextApiResponse) =>{
        if (req.method && !methods.includes(req.method as any)){
            return res.status(404).end()
        }
        if(isPrivate && !req.session.user){
            return res.status(401).json({ok:false})
        }
        else{
            try {
                await handler(req,res);
            } catch (error) {
                return res.status(500).end();
            }
        }
    }
 }

export default withHandler