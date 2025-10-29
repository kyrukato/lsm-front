import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSequenceComponent } from './table-sequence.component';

describe('TableSequenceComponent', () => {
  let component: TableSequenceComponent;
  let fixture: ComponentFixture<TableSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSequenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
