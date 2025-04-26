const { result } = require("lodash");
const user = require("./models/user");

module.exports = function (app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

  // PROFILE SECTION =========================
 
    app.get('/profile', isLoggedIn, function(req, res) {//isLogged in checks to see if youre logged in    
      res.render('profile.ejs', {
        user: req.user
      })
    })
  
  app.post('/profile/newprofile', isLoggedIn, (req, res) => {
    const userId = req.user._id;
    const profileName = req.body.profileName;
    const username = req.body.username;
    db.collection('users').save(
        { _id: userId, },
        { $set: {
        'local.profileName': profileName,
        'local.username': username } 
     },
        (err, result) => {
            if (err) {
                console.error('Error adding profile name:', err);
                return res.status(500).json({ error: 'Error adding profile name' });
            }
            
             // Send a JSON response with the updated profile name
          res.json({ profileName: profileName });
          res.json({ username: username })
        }
    );
  });
  app.post('/profile/newuser', isLoggedIn, (req, res) => {
    const userId = req.user._id;
    const profileName = req.body.profileName;
    const username = req.body.username;
    db.collection('users').save(
        { _id: userId, },
        { $set: {
        'local.profileName': profileName,
        'local.username': username } 
     },
        (err, result) => {
            if (err) {
                console.error('Error adding profile name:', err);
                return res.status(500).json({ error: 'Error adding profile name' });
            }
            
             // Send a JSON response with the updated profile name
          res.json({ profileName: profileName });
          res.json({ username: username })
        }
    );
});
  
  // Change profile name
app.put('/profile/update', isLoggedIn, (req, res) => {
    const userId = req.user._id;
    const newProfileName = req.body.profileName;

    db.collection('users').updateOne(
        { _id: userId, },
        { $set: { 'local.profileName': newProfileName } },
        (err, result) => {
            if (err) {
                console.error('Error updating profile name:', err);
                return res.status(500).json({ error: 'Error updating profile name' });
            }
            console.log('Profile name updated');
             // Send a JSON response with the updated profile name
             res.json({ profileName: newProfileName });
        }
    );
});
  app.put('/profile/updateUsername', isLoggedIn, (req, res) => {
    const userId = req.user._id;
    const newUserName = req.body.username;

    db.collection('users').updateOne(
        { _id: userId },
        { $set: { 'local.username': newUserName } },
        (err, result) => {
            if (err) {
                console.error('Error updating profile name:', err);
                return res.status(500).json({ error: 'Error updating profile name' });
            }
            console.log('Username updated');
             // Send a JSON response with the updated profile name
             res.json({ username: newUserName });
        }
    );
});
    

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout(() => {
          console.log('User has logged out!')
        });
        res.redirect('/');
    });
  // ACCOUNT INFORMATION SECTION ==============================
  app.get('/account', isLoggedIn, function (req, res) {
    res.render('account.ejs', {
      userInfo: req.user
    });
    });

// Dashboard routes ===============================================================
app.get('/dashboard', isLoggedIn, (req, res) => {
  console.log('Dashboard GET route hit');
  db.collection('userTransactions').find({ userId: req.user._id }).toArray() // Filter by user ID
    .then(results => {
      console.log('Transactions found:', results);
      res.render('dashboard', { transactions: results, userInfo: req.user});
    })
    .catch(error => {
      console.error('Error fetching transactions:', error);
      res.status(500).send('Error fetching transactions');
    });
});

app.post('/income', isLoggedIn, (req, res) => {
  console.log('Income POST route hit');
  console.log('Request body:', req.body);
  const income = req.body; // Assuming the data is in req.body
  income.userId = req.user._id;
  db.collection('userTransactions').save(income, (err, result) => {
    if (err) {
      console.error('Error saving income:', err);
      return res.status(500).send('Error saving income');
    }
    console.log('Income saved to database');
    res.status(201).send('Income saved'); // 201 Created
  });
});

app.post('/expense', isLoggedIn, (req, res) => {
  console.log('Expense POST route hit');
  console.log('Request body:', req.body);
  const expense = req.body; // Assuming the data is in req.body
  expense.userId = req.user._id;
  db.collection('userTransactions').save(expense, (err, result) => {
    if (err) {
      console.error('Error saving expense:', err);
      return res.status(500).send('Error saving expense');
    }
    console.log('Expense saved to database');
    res.status(201).send('Expense saved'); // 201 Created
  });
});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {//enable us to have 
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}