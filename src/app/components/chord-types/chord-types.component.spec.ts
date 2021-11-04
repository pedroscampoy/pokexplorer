import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChordTypesComponent } from './chord-types.component';

describe('ChordTypesComponent', () => {
  let component: ChordTypesComponent;
  let fixture: ComponentFixture<ChordTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChordTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChordTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
