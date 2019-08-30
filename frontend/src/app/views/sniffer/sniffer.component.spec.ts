import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnifferComponent } from './sniffer.component';

describe('SnifferComponent', () => {
  let component: SnifferComponent;
  let fixture: ComponentFixture<SnifferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnifferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnifferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
