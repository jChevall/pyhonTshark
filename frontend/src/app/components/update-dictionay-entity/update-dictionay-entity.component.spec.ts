import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDictionayEntityComponent } from './update-dictionay-entity.component';

describe('UpdateDictionayEntityComponent', () => {
  let component: UpdateDictionayEntityComponent;
  let fixture: ComponentFixture<UpdateDictionayEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateDictionayEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateDictionayEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
