import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRoomAuthComponent } from './dialog-room-auth.component';

describe('DialogRoomAuthComponent', () => {
  let component: DialogRoomAuthComponent;
  let fixture: ComponentFixture<DialogRoomAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRoomAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRoomAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
