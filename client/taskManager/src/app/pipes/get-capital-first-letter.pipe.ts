import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getCapitalFirstLetter'
})
export class GetCapitalFirstLetterPipe implements PipeTransform {

  transform(value: string): string {
    return value ? value.charAt(0).toUpperCase() : ''
  }

}
