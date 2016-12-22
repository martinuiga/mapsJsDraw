var expect = chai.expect;
var assert = chai.assert;

describe("Map", function () {
  before(function () {
    shp("../pollud_failide_formaat.zip").then(function (geo) {testmap1.importGeoJson(geo, 'kultuur');});
    testmap1.setupInfoWindow({'hover':true, 'properties':[{name: 'kultuur', displayName: 'Kultuur'},
      {name: 'muutja', displayName: 'Muutja123'}]});
  });
  describe("Area", function () {
    it("infowindow exists on hover", function (done) {
      this.timeout(300);
      setTimeout(function () {
        testmap1._map.data.forEach(function (feature1) {
          google.maps.event.trigger(testmap1._map.data, 'mouseover', {feature:feature1})
        });
        done();
      }, 0);
      setTimeout(function () {
        assert.equal(!!document.getElementById("infoWindow"), true);
        done();
      }, 0);

    });

    it("infowindow contains correct data", function (done) {
      this.timeout(700);
      setTimeout(function () {
        assert.equal(document.getElementById("infoWindow").firstChild.getElementsByTagName('b')[0].innerText, "Kultuur:");
        done();
      }, 400);
    })

  });

  // describe("#greets", function() {
  //   it("should throw if no target is passed in", function() {
  //     expect(function() {
  //       (new Cow()).greets();
  //     }).to.throw(Error);
  //   });
  //
  //   it("should greet passed target", function() {
  //     var greetings = (new Cow("Kate")).greets("Baby");
  //     expect(greetings).to.equal("Kate greets Baby");
  //   });
  // });
});