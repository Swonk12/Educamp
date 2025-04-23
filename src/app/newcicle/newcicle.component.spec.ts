import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcicleComponent } from './newcicle.component';

describe('NewcicleComponent', () => {
  let component: NewcicleComponent;
  let fixture: ComponentFixture<NewcicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewcicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewcicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
