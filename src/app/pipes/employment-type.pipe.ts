import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'employmentType'
})
export class EmploymentTypePipe implements PipeTransform {

  transform(value: string, args?: any): string {
    if (value === 'FULLTIME') {
      value = 'Full-time';
    }
    else if (value === 'PARTTIME') {
      value = 'Part-time';
    }
    else {
      value =  value[0] + value.toLowerCase().slice(1);
    }
    return value;
}

}
