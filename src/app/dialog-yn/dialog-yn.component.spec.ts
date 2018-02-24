import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogYnComponent } from './dialog-yn.component';

describe('DialogYnComponent', () => {
  let component: DialogYnComponent;
  let fixture: ComponentFixture<DialogYnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogYnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogYnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
