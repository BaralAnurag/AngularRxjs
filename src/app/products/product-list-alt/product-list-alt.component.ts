import { Component, ChangeDetectionStrategy  } from '@angular/core';
import { Subscription, EMPTY, Subject, combineLatest } from 'rxjs';
import { ProductService } from '../product.service';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../product';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  private errorMessageSubject = new Subject<string>();
    errorMessage$ = this.errorMessageSubject.asObservable();

  products$ = this.productService.productsWithCategory$
  .pipe(
    catchError(err => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );
  sub: Subscription;

  constructor(private productService: ProductService) { }

selectedProduct$ = this.productService.selectedProduct$;

vm$ = combineLatest([
  this.products$,
  this.selectedProduct$
]).pipe(
  map(([products, product]: [Product[], Product]) =>
  ({products, productId: product ? product.id : 0 }))
);

  onSelected(productId: number): void {
    console.log('Testv Point 1');
    this.productService.selectedProductChanged(productId);
  }
}
