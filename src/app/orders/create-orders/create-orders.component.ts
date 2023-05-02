import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonService } from 'app/services/common.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-create-orders',
  templateUrl: './create-orders.component.html',
  styleUrls: ['./create-orders.component.scss']
})
export class CreateOrdersComponent implements OnInit {
  orderForm: any = FormGroup;
  //orderLinesForm: any = FormGroup;
  orderLinesForm: FormGroup;
  submitted = false;
  orderInfo : any =[];

  constructor(private formBuilder: FormBuilder,
    private commonService:CommonService, private datePipe: DatePipe) { 
      this.orderLinesForm = this.formBuilder.group({  
        orderLines: this.formBuilder.array([]),  
      });
    }

  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({
      distributorId: ['', Validators.required],
      orderDate: ['', Validators.required]
    });
  }

  orderLines() : FormArray {  
    return this.orderLinesForm.get("orderLines") as FormArray  
  }

  createOrder(){
    this.submitted = true;
    if (this.orderForm.value.orderDate){
      //this.orderForm.value.orderDate = this.datePipe.transform(this.orderForm.get('orderDate').value, 'yyyy-MM-dd HH:mm:ss Z');
      this.orderForm.value.orderDate = moment(this.orderForm.value.orderDate).toISOString()
    }
    console.log(this.orderForm.value);
    if (this.orderForm.valid) {
      this.commonService.createOrders(this.orderForm.value).subscribe((response) => { 
        this.orderInfo = response;
        alert('Create Order Successful');
        console.log("this.orderInfo.id",this.orderInfo.id)
      });
    }
  }
  createOrderLine(){
    this.submitted = true;
    
    console.log(this.orderLinesForm.value);
    for(let orderLine of  this.orderLinesForm.value.orderLines){
      console.log("orderLine",orderLine);
      if (this.orderLinesForm.valid) {
        this.commonService.createOrderLines(this.orderInfo.id, orderLine)
          .pipe()
          .subscribe({
              next: () => {
                  alert('Create Order Line Successful');
              },
              error: (error: any) => {
                  console.log('error',error);
                  alert(error);
              }
          });
      }
    }
  }

  newOrderLine(): FormGroup {  
    return this.formBuilder.group({  
      linenum: '',
      orderId: '',
      price: '',
      productId: '',
      quantity: '' 
    })  
  }  
     
  addOrderLine() {  
    this.orderLines().push(this.newOrderLine());  
  }  
     
  removeOrderLine(i:number) {  
    this.orderLines().removeAt(i);  
  }  
  
}
