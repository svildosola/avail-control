import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

interface IResItem {
    startIndex: string;
    endIndex: string
    reservation: any;        
}


@autoinject
export class AvailControl {
  
  units: any;
  availSlots: any;
  resItems: IResItem[];
  

  constructor(private http: HttpClient) {
  
    let unitsIds = ["U1", "U2", "U3", "U4", "U5"];
    this.units = [];
    
    for(let i=0; i<unitsIds.length; i++)
      this.units.push({index: i, id: unitsIds[i]});  
    
    this.availSlots = [];
            
    for (var index = 0; index < 6; index++) {      
      let cDate = new Date(); 
      cDate.setHours(0,0,0,0);     
      cDate.setDate(cDate.getDate() + index);      
      this.availSlots.push({index: index, id: cDate, text: (cDate.getMonth() + 1).toString() + "/" + cDate.getDate()});         
    }    
    
    this.resItems = [];
    this.resItems.push(
      
      {
        startIndex: "1_1",
        endIndex: "1_3",
        reservation: {id: "res 1-1 to 3"}
      },
      {
        startIndex: "1_4",
        endIndex: "1_5",
        reservation: {id: "res 1-4-5"}
      },
      {
        startIndex: "3_2",
        endIndex: "3_5",
        reservation: {id: "res 3-2-5"}
      }
      
    );
               
}

  activate() {

  }
  
  attached(){
    
    for (let i = 0; i < this.resItems.length; i++) {
      let resItemObj = this.resItems[i];
      let $startCell = $("#" + resItemObj.startIndex)
      $startCell.html("<div class='avail-res'><span>" + resItemObj.reservation.id  + "</span></div>");  
    }
    
    
    
    
    
  }
  
  
  
}
