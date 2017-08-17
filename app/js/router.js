EmployeeManager.Router = Backbone.Router.extend({
  routes: {
    '': 'home',
    'employees': 'showEmployees',
    'employees/new': 'newEmployee',
    'employees/edit/:id': 'editEmployee',
    'login': 'login',
    'callback': 'callback'
  }
});
