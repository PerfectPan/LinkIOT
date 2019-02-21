import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlarmLogComponent } from './alarm-log.component';

describe('AlarmLogComponent', () => {
  let component: AlarmLogComponent;
  let fixture: ComponentFixture<AlarmLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlarmLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlarmLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
