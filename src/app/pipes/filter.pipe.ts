import {PipeTransform, Injectable, Pipe} from "@angular/core";
@Pipe({
  name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
  transform(items: any[], field : any, value : any): any[] {
    if (!items) return [];
    return items.filter(it => it[field] == value);
  }
}
/**
 * Created by lucidokr on 20/06/17.
 */
