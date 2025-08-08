import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarUser } from './toolbar-user';

describe('ToolbarUser', () => {
  let component: ToolbarUser;
  let fixture: ComponentFixture<ToolbarUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
