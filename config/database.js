// config/database.js

//set up unique url
module.exports = {

    'url' : `mongodb+srv://${process.env.USER_ID}:${process.env.DB_password}@cluster0.vhrw8jw.mongodb.net/BugdetFrame?retryWrites=true&w=majority&appName=Cluster0`, 
    'dbName': 'BudgetFrame'
};
