import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Framework } from 'src/app/core/models/framework.model';
import { Store } from '@ngrx/store';
import { dataSelector } from 'src/app/core/store/selectors';
import { SetData } from 'src/app/core/store/actions';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  dataStore$ = this.store.select(dataSelector);
  dataValue: any;
  dataSource: any;
  // public dataSource: Array<Framework> = [
  //   { Framework: 'Vuel', Stars: 166443, Released: '2014' },
  //   { Framework: 'React', Stars: 150793, Released: '2013' },
  //   { Framework: 'Angular', Stars: 62342, Released: '2016' },
  //   { Framework: 'Backbone', Stars: 27647, Released: '2010' },
  //   { Framework: 'Ember', Stars: 21471, Released: '2011' },
  // ];

  form = this.fb.group({
    // title: [''],
    // subTitle: [''],
    data: this.fb.array([]),
  });

  constructor(private fb: FormBuilder, public store: Store) {}

  ngOnInit(): void {
    this.dataStore$.subscribe(data => {this.dataValue = data; this.dataSource = data})
    this.form = this.fb.group({
      // title: ['Title', Validators.required],
      // subTitle: ['Subtitle', Validators.required],
      data: this.fb.array(this.dataSource.map((framework: Framework) => this.updateData(framework)))
    });
    this.dataValue = this.form.value['data'];
    this.form.valueChanges.pipe(delay(1000)).subscribe(status => {
      if (this.form.valid) {this.store.dispatch(SetData(this.form.value))}
    })
  }

  onSubmit() {
    this.dataValue = this.form.value;
    this.store.dispatch(SetData(this.dataValue))
  }

  updateData(data: Framework): FormGroup {
    return this.fb.group({
      Framework: [data.Framework, Validators.required],
      Stars: [data.Stars, Validators.required],
      Released: [data.Released, Validators.required],
    });
  }

  get data() {
    return this.form.get('data') as FormArray;
  }

  onAddData() {
    const dataForm = this.fb.group({
      Framework: ['', Validators.required],
      Stars: ['', Validators.required],
      Released: ['', Validators.required]
    });
    this.data.push(dataForm);
  }

  onDeleteData(dataIndex: number) {
    this.data.removeAt(dataIndex)
  }
}
