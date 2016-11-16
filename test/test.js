require('chai').should();
 
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
 
var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();
  

before(function(done) {
    var express = require('express');
    var path = require('path');
    //var logger = require('morgan');

    var app = express();
    app.set('port', process.env.PORT || 3000);
    app.listen(app.get('port'),
      function(){
        console.log("Express server listening on port " + app.get('port'));
        //app.use(logger('dev'));
        app.use(express.static(path.join(__dirname, '../')));
    });
    done();
});


after(() => {
  return driver.quit();
});

describe('example page', () => {
    var page = driver.get('http://localhost:3000/example.html');
    it('title', function(done) {
        this.timeout(25000);
        page.then(() => driver.getTitle())
            .then((title) => title.should.equal('An LD2h demo page'))
            .then(() => done());
    });
    it('inline content', function(done) {
        this.timeout(25000);
        //delaying execution by 10 ms to allow for asynchrnous rendering
        setTimeout(() => page.then(() => driver.findElements(By.xpath("//span[@resource='https://farewellutopia.com/me']")))
            .then(elements => elements[0].getText())
            .then((text) => text.should.equal("Name: Reto Gmür"))
            .then(() => done()), 10);
    });
    it('remote content', function(done) {
        this.timeout(25000);
        //delaying execution by 3000 ms to allow loading remote content
        setTimeout(() => page.then(() => driver.findElements(By.xpath("//span[@resource='http://schema.org/BusOrCoach']")))
            .then(elements => elements[0].getText())
            .then((text) => text.should.equal("Label: BusOrCoach"))
            .then(() => done()), 3000);
    });
});
