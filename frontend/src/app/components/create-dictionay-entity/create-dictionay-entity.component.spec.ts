import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDictionayEntityComponent } from './create-dictionay-entity.component';

describe('CreateDictionayEntityComponent', () => {
  let component: CreateDictionayEntityComponent;
  let fixture: ComponentFixture<CreateDictionayEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDictionayEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDictionayEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
