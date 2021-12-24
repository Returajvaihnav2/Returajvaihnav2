import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealOverViewComponent } from './deal-over-view.component';

describe('DealOverViewComponent', () => {
  let component: DealOverViewComponent;
  let fixture: ComponentFixture<DealOverViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealOverViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealOverViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
