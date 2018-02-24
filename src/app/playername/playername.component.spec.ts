import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayernameComponent } from './playername.component';

describe('PlayernameComponent', () => {
  let component: PlayernameComponent;
  let fixture: ComponentFixture<PlayernameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayernameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
