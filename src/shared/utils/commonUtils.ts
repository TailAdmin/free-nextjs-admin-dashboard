
export function convertTimeStampToLocaleDateString(timeStamp: number): string {

    if (!timeStamp) return "";

    const dateString = new Date(timeStamp*1000).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, 
        timeZone: 'UTC', 
    })
    return dateString;
}    

export function convertISODateToLocaleDateString(isoDate: string): string {

        if (!isoDate) return "";
    
        const dateString = new Date(isoDate).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true, 
        })
    return dateString;
}   

export function convertDateStringToTimeStampInSeconds(date: string, time: string = "T00:00:00Z"): number {
    if (!date) return 0;
    const reformattedDate = date.replace(/(\d{2})-(\d{2})-(\d{4})/,"$3-$1-$2");
    const dateDate = new Date(reformattedDate + time);
    const dateTS = Math.floor(dateDate.getTime()/1000);
    return dateTS;
}

