import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(value: any[], order = '', column: string = ''): any[] {
    if (!value || order === '' || !order) { return value; } // no array
    if (!column || column === '') { return _.sortBy(value); } // sort 1d array
    if (value.length <= 1) { return value; } // array with only one item
    return _.orderBy(value, [column], [order]);
  }

}
@Pipe( {
  name: 'orderBy'
  } )
  export class OrderByPipe implements PipeTransform {
  transform( array: Array<any>, orderField: string, orderType: boolean ): Array<string> {
      array.sort( ( a: any, b: any ) => {
          let ae = a[ orderField ];
          let be = b[ orderField ];
          if ( ae == undefined && be == undefined ) return 0;
          if ( ae == undefined && be != undefined ) return orderType ? 1 : -1;
          if ( ae != undefined && be == undefined ) return orderType ? -1 : 1;
          if ( ae == be ) return 0;
          return orderType ? (ae.toString().toLowerCase() > be.toString().toLowerCase() ? -1 : 1) : (be.toString().toLowerCase() > ae.toString().toLowerCase() ? -1 : 1);
      } );
      return array;
    }
  }

  @Pipe({
    name: 'filter'
  })
  export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string, field:string): any[] {
      if(!items) return [];
      if(!searchText) return items;
      searchText = searchText.toLowerCase();  
      return items.filter( it => {    
        return it[field].toLowerCase().includes(searchText);
      });
     }
  }