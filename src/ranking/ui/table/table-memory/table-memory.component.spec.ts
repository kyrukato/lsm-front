import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableMemoryComponent } from './table-memory.component';

describe('TableMemoryComponent', () => {
  let component: TableMemoryComponent;
  let fixture: ComponentFixture<TableMemoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableMemoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableMemoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
