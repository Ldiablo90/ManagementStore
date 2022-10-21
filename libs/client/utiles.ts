export const cls = (...classnames: string[]) => classnames.join(" ");
export const onlyDate = (uDate: Date) => (`${uDate.toString().split("T")[0]} ${uDate.toString().split("T")[1].slice(0,8)}`);
export const storeRank = (rank:number)=>{
    const temp = ""
    if(rank)
    return temp
}
export const localeString = (value:number)=> value.toLocaleString("ko-KR") 

export const koTime = (uDate:Date) => {
    const target = new Date(uDate);
    const tDate = `${target.getFullYear()}-`+`0${target.getMonth()+1}`.slice(-2)+'-'+`0${target.getDate()}`.slice(-2);
    const tTime = ` ${target.getHours()}:`+`0${target.getMinutes()}`.slice(-2)+':'+`0${target.getSeconds()}`.slice(-2);
    return tDate + tTime;
}