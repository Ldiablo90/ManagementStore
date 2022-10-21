import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface UserWithUserKind extends User{
    kind:{
        rank:number;
        rankName:String;
    }
}

interface ProfileResponse{
    ok:boolean;
    profile:UserWithUserKind;
}
const useUser = ()=> {
    const router = useRouter();
    const {data, error} = useSWR<ProfileResponse>("/api/users/me");
    useEffect(()=>{
        console.log("userUser")
        if(data && !data.ok){router.replace("/login",undefined);}
    },[data])
    return {user:data?.profile, isLodding: !data && !error};
}
export default useUser;