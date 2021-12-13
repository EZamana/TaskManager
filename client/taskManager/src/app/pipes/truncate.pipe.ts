import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string | null, limit = 100, completeWords = false) {
    if (value) {
     if (completeWords && value.length > limit) {
       value = value.substr(0, limit)
       return value.substr(0, value.lastIndexOf(' ')) + '...'
     }

     return value.length > limit ? value.substr(0, limit) + '...' : value

   } else {
     return ''
   }
  }

}
