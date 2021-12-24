import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSubMenuComponent } from './side-sub-menu.component';

describe('SideSubMenuComponent', () => {
  let component: SideSubMenuComponent;
  let fixture: ComponentFixture<SideSubMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideSubMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideSubMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
