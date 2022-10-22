import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  customers: any;
  test: any;

  constructor(private customerService: CustomersService) { }

  ngOnInit(): void {
    //this.addCustomer();
    //this.deleteCustomer(4);
    // this.updateCustomer(4);
    this.getCustomers();
  }

  getCustomers() {
    this.customerService.getCustomers().subscribe(data => this.customers = data);
  }

  deleteCustomer(id: any) {
    this.customerService.deleteCustomer(id).subscribe(data => this.customers = this.customers.filter((cust: any) => cust.id !== id));
    // window.location.reload();
    // console.log(event);
  }
}
