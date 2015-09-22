import { Component, View } from 'angular2/angular2';
import { ROUTER_DIRECTIVES, RouteConfig } from 'angular2/router';
import { Ants } from '../ants/ants';

// import { CustomersComponent } from '../customers/customers-component';
// import { OrdersComponent } from '../orders/orders-component';
import { DataService } from 'app/services/data-service';

@Component({ selector: 'app' })
@View({
  template: `<router-outlet></router-outlet>`,
  directives: [ROUTER_DIRECTIVES],
})
@RouteConfig([
  { path: '/',              as: 'ants',  component: Ants }
  // { path: '/ants',    as: 'orders',     component: OrdersComponent    }
])
export class AppComponent {

}
