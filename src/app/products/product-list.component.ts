import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Subscription, EMPTY, Subject, combineLatest, BehaviorSubject } from 'rxjs';
import { ProductService } from './product.service';
import { catchError, map, startWith } from 'rxjs/operators';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ = this.categorySelectedSubject.asObservable();


  products$ = combineLatest([
    this.productService.productsWithAdd$,
    this.categorySelectedAction$
  ])
  .pipe(
    map(([products, selectedCategoryId]) =>
    products.filter(product =>
      selectedCategoryId ? product.categoryId === selectedCategoryId : true
    )),
    catchError( err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  categories$ = this.productCategoryService.productCategories$
  .pipe(
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );


  sub: Subscription;

  constructor(private productService: ProductService,
              private productCategoryService: ProductCategoryService) { }


  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }
}
