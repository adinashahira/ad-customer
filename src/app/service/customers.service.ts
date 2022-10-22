import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private url = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  getCustomers() {
    return this.http.get(this.url);
  }

  getCustomer(id: any): Observable<any> {
    return this.http.get(`${this.url}/${id}`);
  }

  addCustomer(data: any) {
    return this.http.post(this.url, data);
  }

  deleteCustomer(id: any) {
    return this.http.delete(`${this.url}/${id}`);
  }

  updateCustomer(id: any, payload: any) {
    return this.http.put(`${this.url}/${id}`, payload);
  }
}
