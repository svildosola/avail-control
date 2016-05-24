import {autoinject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import 'fetch';

import 'jquery-ui';

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
  unitsDto: any;
 

  constructor(private http: HttpClient) {
  
    this.createRows();
    this.createColumns();
    
    //loading data
    this.loadData(new Date(2016, 5, 1), new Date(2016, 5, 8));
                                        
}

  activate() {


  }
  
  attached(){
    var self = this;
    self.paintResItems();
    
    //datepicker
    $("#datepicker").datepicker();    

    //re-paint reservation items if window is browser windows size changes            
    $(window).resize(function(){      
      self.paintResItems();
    });
                                 
  }
  
  /*=======================================================================
  CONTROL METHODS
  ========================================================================*/
  paintResItems(){
    
    $(".avail-mainContainer").find(".avail-res").remove();
    
     let lastColumn = this.columns.columns[this.columns.columns.length - 1]; 
    
    //iterate over reservations in order to paint them on the control
    for (let res of this.reservations)
    {
      let row: IRowData = this.rows.rowsAsProperties[res.unit]; //get row for reservation using the unit id
      let column: IColumnData = this.columns.columnsAsProperties[res.arrival.getTime()]; //get column using res arrival as column key
      let endColumn: IColumnData = lastColumn.id >= res.departure ? this.columns.columnsAsProperties[res.departure.getTime()]: lastColumn;
      let $startCell = $("#" + row.index + "_" + column.index); //get cell where the res will be placed
      let $endCell = $("#" + row.index + "_" + endColumn.index); //get end cell where the res will be placed
      
      let itemWidth = $endCell.offset().left - $startCell.offset().left - 5;
                 
      //add res item element to dom 
      let $item = $("<div class='avail-res'><span>" + res.text + "</span></div>");  
      $item.width(itemWidth);
      $startCell.html($item);   
    }
    
  }
  
  
 /*==========================================================================
  CONTROL DATA METHODS
  ===========================================================================*/  
  createRows(){
    this.rows = {rows: [], rowsAsProperties: {}};
    
     this.unitsDto = this.getUnits(); //get units from api
    
    for(let i=0; i<this.unitsDto.length; i++){
      let row: IRowData;
      row = {index: i, id: this.unitsDto[i], text: this.unitsDto[i]};
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
  
  loadData(dtFrom: Date, dtpTo: Date){    
    this.reservations = this.getReservation(dtFrom, dtpTo, this.unitsDto); //api call            
  }
  
 
   
  /*==========================================================================
  API METHODS
  ===========================================================================*/
  getUnits(){
    
    return ["U1-1", "U2-1", "U3-1", "U4-1", "U5-1", "U6-1"];
  }
  
  getReservation(dtFrom: Date, dtTo: Date, units: string[]): IReservationDTO[] {
    
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
      if (res.arrival >= dtFrom && res.arrival <= dtTo && $.inArray(res.unit, units) > -1)      
        result.push(res);                      
    }
    
    return result;
    
  }  
  
}
