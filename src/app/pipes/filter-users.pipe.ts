import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../models/user';

@Pipe({
  name: 'filterUsers'
})
export class FilterUsersPipe implements PipeTransform {

  transform(users: User[], searchText: string): User[] {
    if (!users)       return [];
    if (!searchText)  return users;

    searchText = searchText.toLowerCase();
    return users.filter(
      user => {
        return user.fullName!.toLowerCase().includes(searchText);
      }
    );
  }

}
