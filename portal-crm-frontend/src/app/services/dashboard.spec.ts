import { TestBed } from '@angular/core/testing';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Dashboard {
  constructor() { }

 
}


describe('Dashboard', () => {
  let service: Dashboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dashboard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
