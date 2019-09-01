import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapViewComponent } from './heatmap-view.component';

describe('HeatmapViewComponent', () => {
  let component: HeatmapViewComponent;
  let fixture: ComponentFixture<HeatmapViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatmapViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatmapViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
