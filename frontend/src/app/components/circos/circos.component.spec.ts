import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CircosComponent } from './circos.component';

describe('CircosComponent', () => {
  let component: CircosComponent;
  let fixture: ComponentFixture<CircosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CircosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CircosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
