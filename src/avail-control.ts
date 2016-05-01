import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

//Control interfaces

/*
interface IResItem {
    startIndex: string;
    endIndex: string;
    itemLen: number;
    reservation: any;        
}
*/
interface IColumnData{
  index: number,
  id: Date,
  text: string
}

interface IRowData{
  index: number,
  id: string,
  text: string
}

interface IColumms{
  columns: IColumnData[],
  columnsAsProperties: any
}

interface IRows{
  rows: IRowData[],
  rowsAsProperties: any
}

//End of Control Interfaces

interface IReservationDTO{
  id: string,
  stayLen: number,
  arrival: Date,
  departure: Date,
  text: string,
  unitType: string,
  unit: string
  
}

@autoinject
export class AvailControl {
  
  rows: IRows;
  columns: IColumms;
  reservations: IReservationDTO[];
 

  constructor(private http: HttpClient) {
  
    this.createRows();
    this.createColumns();
    this.reservations = this.getReservation(new Date(2016, 5, 1), new Date(2016, 5, 8)); //api call           
                 
}

  activate() {

  }
  
  attached(){
    
    
    //iterate over reservations in order to paint them on the control
    for (let res of this.reservations)
    {
      let row: IRowData = this.rows.rowsAsProperties[res.unit]; //get row for reservation using the unit id
      let column: IColumnData = this.columns.columnsAsProperties[res.arrival.getTime()]; //get column using res arrival as column key
      let $startCell = $("#" + row.index + "_" + column.index); //get cell where the res will be placed
      
      let lastColumn = this.columns.columns[this.columns.columns.length - 1]; 
      
      //compute res item width. if res departure date is greater than last displayed control column, then width can't be the reservation stay length
      let widthFactor: number = lastColumn.id >= res.departure ? res.stayLen : lastColumn.index - column.index;
      let columnWidth = $startCell.width();
      columnWidth += columnWidth * 0.20 //add 20% 
       
      //add res item element to dom 
      let $item = $("<div class='avail-res'><span>" + res.text + "</span></div>");  
      $item.width( columnWidth * widthFactor);
      $startCell.html($item);   
    }
    
  
  }
  
  
 /*==========================================================================
  CONTROL DATA METHODS
  ===========================================================================*/  
  createRows(){
    this.rows = {rows: [], rowsAsProperties: {}};
    
     let unitsIds = this.getUnits(); //get units from api
    
    for(let i=0; i<unitsIds.length; i++){
      let row: IRowData;
      row = {index: i, id: unitsIds[i], text: unitsIds[i]};
      this.rows.rowsAsProperties[row.id] = row;
      this.rows.rows.push(row);
    }
        
  }
  
  createColumns(){
   
     this.columns = {columns: [], columnsAsProperties: {}};
            
    for (var index = 0; index < 6; index++) {      
      let cDate = new Date(2016, 5, 1); 
      cDate.setHours(0,0,0,0);     
      cDate.setDate(cDate.getDate() + index);      
      let column:IColumnData;
      column = {index: index, id: cDate, text: (cDate.getMonth() + 1).toString() + "/" + cDate.getDate()};
      this.columns.columnsAsProperties[column.id.getTime()] = column;
      this.columns.columns.push(column);         
    }
   
  }
  
 
   
  /*==========================================================================
  API METHODS
  ===========================================================================*/
  getUnits(){
    
    return ["U1-1", "U2-1", "U3-1", "U4-1", "U5-1", "U6-1"];
  }
  
  getReservation(dtFrom: Date, dtTo: Date): IReservationDTO[] {
    
    let resDtos: IReservationDTO[];
    resDtos = [
      {
       id: "res1",
       arrival: new Date(2016, 5, 1),
       departure: new Date(2016, 5, 4),
       stayLen: 3,
       text: "U1-1_1 to 4",
       unitType: "1BR",
       unit: "U1-1"
      },
      {
       id: "res2",
       arrival: new Date(2016, 5, 4),
       departure: new Date(2016, 5, 6),
       stayLen: 2,
       text: "U1-1_4 to 6",
       unitType: "1BR",
       unit: "U1-1"
      },
      {
       id: "res3",
       arrival: new Date(2016, 5, 2),
       departure: new Date(2016, 5, 6),
       stayLen: 4,
       text: "U2-1_2 to 6",
       unitType: "1BR",
       unit: "U2-1"
      }
    
    ];
    
    let result = [];
    
    for (let res of resDtos)
    {
      if (res.arrival >= dtFrom && res.arrival <= dtTo)
        result.push(res);
    }
    
    return result;
    
  }  
  
}
