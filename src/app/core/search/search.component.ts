import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'search-box',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild("search") search: ElementRef;
  @Output() text = new EventEmitter<any>();
  @Output() remove = new EventEmitter<any>();
  @Input() placeholder = 'PROFILE.SEARCH';
  constructor() {}

  ngOnInit() {}

  searchAction(text: any) {
    this.text.emit(text);
  }

  close(){
    this.search.nativeElement.value=''
    let text=''
    this.remove.emit(text);
  }
}
