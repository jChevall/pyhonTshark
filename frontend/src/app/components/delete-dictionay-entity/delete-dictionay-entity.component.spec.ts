import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDictionayEntityComponent } from './delete-dictionay-entity.component';

describe('DeleteDictionayEntityComponent', () => {
  let component: DeleteDictionayEntityComponent;
  let fixture: ComponentFixture<DeleteDictionayEntityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDictionayEntityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDictionayEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
