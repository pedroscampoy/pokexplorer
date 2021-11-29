import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Framework } from 'src/app/core/models/framework.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  public dataSource: Array<Framework> = [
    { Framework: 'Vue', Stars: 166443, Released: '2014' },
    { Framework: 'React', Stars: 150793, Released: '2013' },
    { Framework: 'Angular', Stars: 62342, Released: '2016' },
    { Framework: 'Backbone', Stars: 27647, Released: '2010' },
    { Framework: 'Ember', Stars: 21471, Released: '2011' },
  ];

  dataValue: any;

  form = this.fb.group({
    title: [''],
    subTitle: [''],
    data: this.fb.array([]),
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['Title', Validators.required],
      subTitle: ['Subtitle', Validators.required],
      data: this.fb.array(this.dataSource.map((framework: Framework) => this.updateData(framework)))
    });
    this.dataValue = this.form.value;
  }

  onSubmit() {
    this.dataValue = this.form.value;
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

  deleteData(dataIndex: number) {
    this.data.removeAt(dataIndex)
  }
}
