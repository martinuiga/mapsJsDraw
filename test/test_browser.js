var expect = chai.expect;
var assert = chai.assert;
describe("Map", function () {

  before("asd", function (done) {
    this.timeout(1000);
    setTimeout(function () {
      testmap1.setupInfoWindow({'hover':true, 'properties':[{name: 'kultuur', displayName: 'kultuur'},
        {name: 'muutja', displayName: 'muutja'}]});
      shp("../pollud_failide_formaat.zip").then(function (geo) {
        testmap1.importGeoJson(geo, 'kultuur');
        done();
      });
    }, 500);

  });

  it("asd", function (done) {
    describe("Infowindow content checking", function () {
      testmap1._map.data.forEach(function (feature1) {
        it("triggers infowindow", function (done) {
          google.maps.event.trigger(testmap1._map.data, 'mouseover', {feature:feature1});
          done();
        });
        it("checks infowindow content", function (done) {
          var text2 = document.getElementById("infoWindow").firstChild.childNodes[1].data;
          text2 = text2.substr(1);
          console.log(text2);
          assert.equal(text2, feature1.getProperty('kultuur'));
          done();
        });
        it("triggers mouseout", function (done) {
          google.maps.event.trigger(testmap1._map.data, 'mouseout', {feature:feature1});
          done();
        });
      });

    });
    done();
  });
});