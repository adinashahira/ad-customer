import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';

import { CustomersService } from '../service/customers.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss']
})
export class AddCustomerComponent implements OnInit {
  public dialogSuccess = false;
  public dialogMessage = "";
  newCustomerForm: FormGroup;
  custGender: any;
  customers: any;
  customer: any;
  isImageSaved: boolean = false;
  cardImageBase64: string = "";
  pageHeader: string = "Add New Customer";
  customerId: any;
  pageFunction: any = "add";

  constructor(private fb: FormBuilder, private customerService: CustomersService, private activatedRoute: ActivatedRoute, private router: Router) { 
    this.newCustomerForm = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      image: ['']
    })

    this.custGender = [
      {
        name: 'Female',
        code: 'female'
      },
      {
        name: 'Male',
        code: 'male'
      }
    ]
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.url[0].path === "edit") {
      this.pageFunction = "edit";
      this.customerId = this.activatedRoute.snapshot.url[1].path;
      this.pageHeader = "Edit Customer Information"
      this.customerService.getCustomer(this.customerId).subscribe(data => {
        this.customer = data;
        this.newCustomerForm.controls['name'].setValue(this.customer.name);
        this.newCustomerForm.controls['dob'].setValue(new Date(this.customer.dob));
        this.newCustomerForm.controls['gender'].setValue(this.customer.gender);
        this.newCustomerForm.controls['image'].setValue(this.customer.image);
      });
    }
  }

  onSubmit(data: any) {
    let customerData;
    let customerImage;

    if(this.pageFunction === 'add') { //add new customer
      this.newCustomerForm.controls['image'].setValue(this.cardImageBase64);
      customerData = {
        ...data,
        image: this.newCustomerForm.controls['image'].value
      }
      this.dialogMessage = "New customer registered!"
      this.customerService.addCustomer(customerData).subscribe(data => this.customers.push(data));
      //edit customer
    } else if (this.pageFunction === 'edit') { //update customer info
      if(!data.image) { //customer has no existing image
        if (!this.isImageSaved) { //update + customer has no existing image + customer doesn't want to add image
          customerImage = "";
        }
        else { //update + customer has no existing image + customer wants to add image
          this.newCustomerForm.controls['image'].setValue(this.cardImageBase64);
          customerImage = this.newCustomerForm.controls['image'].value
        }
      }
      else { //update + customer HAS existing image
        if (!this.isImageSaved) { //update + HAS existing + customer doesn't wants to change image
          customerImage = this.newCustomerForm.controls['image'].value
        }
        else { //update + HAS existing + want to change image
          this.newCustomerForm.controls['image'].setValue(this.cardImageBase64);
          customerImage = this.newCustomerForm.controls['image'].value
        }
      }
      customerData = {
        ...data,
        image: customerImage
      }
      this.dialogMessage = "Customer information updated!"
      this.customerService.updateCustomer(this.customerId, customerData).subscribe(data => this.customer = data);
    }
    this.dialogSuccess = true;
  }

  backToHome() {
    this.dialogSuccess = false;
    setTimeout(() => {
      this.router.navigate(['/'])
    }, 1000)
  }

  fileChangeEvent(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpg',
        'image/jpeg',
        'application/pdf',
        'image/png',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
        const max_height = 15200;
        const max_width = 25600;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                    const imgBase64Path = e.target.result;
                    this.cardImageBase64 = imgBase64Path;
                    // console.log(`sini1: `, this.cardImageBase64);
                    this.isImageSaved = true;
                    // this.previewImagePath = imgBase64Path;
            };
        };
        return reader.readAsDataURL(fileInput.target.files[0]);
    }
  }
}
