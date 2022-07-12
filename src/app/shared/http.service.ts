import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Customer } from './customer';

const url = 'https://ng-firebase-deploy-c23c6-default-rtdb.europe-west1.firebasedatabase.app/customers'
const httpOptions = {headers: new HttpHeaders({'Content-Type': 'aplication/json'})}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  customers: Customer[] = []
  constructor(private httpClient: HttpClient) {
  }

  //CRUD
  //create => POST
  createData(customer: Customer) {
    this.httpClient.post<Customer>(`${url}.json`, customer, httpOptions).subscribe({
      next: res => this.customers.push({...{key: res.name},...customer}),
      error: catchError(this.errorHandler<Customer>('POST'))
    })
  }

  //read => GET
  getData() {
    this.httpClient.get<Customer[]>(`${url}.json`, httpOptions).subscribe({
      next: res => {
        console.log(res)
        Object.keys(res).forEach(key => this.customers.push({key, ...res[key as any]}))
      },
      error: catchError(this.errorHandler<Customer[]>('GET'))
    })
  }

  //update => PUT / PATCH
  updateData(customer: Customer, i: number): void {
    const {key, ...data} = customer
    this.httpClient.put<Customer>(`${url}/${key}.json`, data, httpOptions).subscribe({
      next: () => this.customers[i] = customer,
      error: catchError(this.errorHandler<Customer>('PUT'))
    })
  }

  //update => DELETE
  deleteData(customer: Customer): void {
    this.httpClient.delete<void>(`${url}/${customer.key}.json`).subscribe({
      next: () => this.customers.splice(this.customers.indexOf(customer), 1),
      error: catchError(this.errorHandler<Customer>('DELETE'))
    })
  }

  private errorHandler<T>(operation: string, res?: T): any {
    return (err: any): Observable<T> => {
      console.error(`${operation} failed: ${err}`)
      return of(res as T)
    }
  }
}
