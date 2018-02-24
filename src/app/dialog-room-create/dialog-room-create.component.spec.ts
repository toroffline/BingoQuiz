import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRoomCreateComponent } from './dialog-room-create.component';

describe('DialogRoomCreateComponent', () => {
  let component: DialogRoomCreateComponent;
  let fixture: ComponentFixture<DialogRoomCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogRoomCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRoomCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
