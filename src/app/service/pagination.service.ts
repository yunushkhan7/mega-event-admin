
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  
  pageChanged = new BehaviorSubject(false);
  constructor() { }

  getPager(recordCount: number, currentPage: number = 1, currentPageLimit: number = environment.defaultPageLimit) {
    let totalPages = Math.ceil(recordCount / currentPageLimit);
    if (totalPages !== undefined && totalPages !== null && totalPages !== 0) {
      // ensure current page isn't out of range
      if (currentPage < 1) {
        currentPage = 1;
      } else if (currentPage > totalPages) {
        currentPage = totalPages;
      }

      let startPage: number, endPage: number;
      if (totalPages <= 10) {
        // less than 10 total pages so show all
        startPage = 1;
        endPage = totalPages;
      } else {
        // more than 10 total pages so calculate start and end pages
        if (currentPage <= 6) {
          startPage = 1;
          endPage = 6;
        } else if (currentPage >= totalPages) {
          startPage = totalPages;
          endPage = totalPages;
        } else {
          startPage = currentPage - 5;
          endPage = currentPage;
        }
      }

      // create an array of pages to ng-repeat in the pager control
      const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);
      // return object with all pager properties required by the view
      return {
        currentPage: currentPage,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        pages: pages
      };
    }
  }
  setPageChanged(val) {
    this.pageChanged.next(val);
  }
}
