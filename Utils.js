class Utils{

    static dateFormat(date){
        let tempo = date.getMinutes();
        
        if(date.getMinutes() < 10) {
            tempo = '0' + date.getMinutes();
        } 

        return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+tempo;
        
    }

}