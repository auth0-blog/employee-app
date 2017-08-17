window.EmployeeManager = {
  Models: {},
  Collections: {},
  Views: {},

  start: function(data) {
    var employees = new EmployeeManager.Collections.Employees(data.employees),
        router = new EmployeeManager.Router();

    router.on('route:home', function() {
      router.navigate('employees', {
        trigger: true,
        replace: true
      });
    });

    router.on('route:showEmployees', function() {
      var employeesView = new EmployeeManager.Views.Employees({
        collection: employees
      });

      $('.main-container').html(employeesView.render().$el);
    });

    router.on('route:newEmployee', function() {
      var newEmployeeForm = new EmployeeManager.Views.EmployeeForm({
        model: new EmployeeManager.Models.Employee()
      });

      newEmployeeForm.on('form:submitted', function(attrs) {
        attrs.id = employees.isEmpty() ? 1 : (_.max(employees.pluck('id')) + 1);
        employees.add(attrs);
        router.navigate('employees', true);
      });

      $('.main-container').html(newEmployeeForm.render().$el);
    });

    router.on('route:editEmployee', function(id) {
      var employee = employees.get(id),
          editEmployeeForm;

      if (employee) {
        editEmployeeForm = new EmployeeManager.Views.EmployeeForm({
            model: employee
        });

        editEmployeeForm.on('form:submitted', function(attrs) {
          employee.set(attrs);
          router.navigate('employees', true);
        });

        $('.main-container').html(editEmployeeForm.render().$el);
      } else {
        router.navigate('employees', true);
      }
    });

    router.on('route:callback', function() {
        webAuth.parseHash({ hash: window.location.hash }, function(err, authResult) {

          if (authResult && authResult.accessToken && authResult.idToken) {

            console.log(window.location.hash);
            //window.location.hash = '#';
            // Set the time that the access token will expire at
            var expiresAt = JSON.stringify(
              authResult.expiresIn * 1000 + new Date().getTime()
            );

            localStorage.setItem('access_token', authResult.accessToken);
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('expires_at', expiresAt);

            $('.login-status').html('<p> You are logged in! </p>');

            router.navigate('employees/new', true);

          } else if (err) {
            console.log(err);
            alert(
              'Error: ' + err.error + '. Check the console for further details.'
            );
          }
        });
    });

    router.on('route:login', function() {
      console.log("clicked on login");
      var webAuth = new auth0.WebAuth({
        domain: 'unicoder.auth0.com',
        clientID: 'QQ2jsARrlQyTUYlcQJBoWe6uS1rCEDe7',
        redirectUri: 'http://localhost:8080/#callback',
        audience: 'https://unicoder.auth0.com/userinfo',
        responseType: 'token id_token',
        scope: 'openid email profile'
      });

      webAuth.authorize();
    });

    Backbone.history.start();
  },

  auth: function() {
    var webAuth = new auth0.WebAuth({
      domain: 'unicoder.auth0.com',
      autoParseHash: true,
      clientID: 'QQ2jsARrlQyTUYlcQJBoWe6uS1rCEDe7',
      redirectUri: 'http://localhost:8080/#/callback',
      audience: 'https://unicoder.auth0.com/userinfo',
      responseType: 'token id_token',
      scope: 'openid email profile'
    });

    var loginBtn = $('#btn-login');


    loginBtn.click(function(e) {
      e.preventDefault();
      console.log("Clicked the button");
      webAuth.authorize();
    });
  },

  isAuthenticated: function() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
};
