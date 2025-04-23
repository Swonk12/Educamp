import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesinscribirseComponent } from './desinscribirse.component';

describe('DesinscribirseComponent', () => {
  let component: DesinscribirseComponent;
  let fixture: ComponentFixture<DesinscribirseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DesinscribirseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DesinscribirseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
