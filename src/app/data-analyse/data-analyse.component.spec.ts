import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAnalyseComponent } from './data-analyse.component';

describe('DataAnalyseComponent', () => {
  let component: DataAnalyseComponent;
  let fixture: ComponentFixture<DataAnalyseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataAnalyseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAnalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
