var expect = chai.expect;
var assert = chai.assert;
describe("Map", function () {

  before("asd", function (done) {
    this.timeout(1000);
    setTimeout(function () {
      testmap2.importGeoJson(geo, 'id');
      testmap1.setupInfoWindow({'hover':true, 'properties':[{name: 'kultuur', displayName: 'kultuur'}]});
      testmap2.setupInfoWindow({'hover':false, 'editable':true, 'properties':[{name: 'id', displayName: 'id'}]});
      shp("../pollud_failide_formaat.zip").then(function (geo) {
        testmap1.importGeoJson(geo, 'kultuur');
        done();
      });
    }, 500);

  });

  it("checks stuff", function (done) {
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
  it("changes area property", function (done) {
    testmap2.editProperties(444, 'propp', 'valuee');
    done();
  });
  it('groups by new property', function (done) {
    testmap2.groupAreasByProperty('propp');
    done();
  });
  it('displays areas by property', function (done) {
    testmap1.displayAreasByProperty({'kultuur':['pÃµlduba, v.a "JÃµgeva"', 'roosa ristik (100% ristikut)']});
    done();
  });
  it('displays all areas', function (done) {
    testmap1.displayAllAreas();
    done();
  });
  it('selects an area', function (done) {
    testmap2.selectArea(444);
    done();
  });
  it('saves areas to localStorage', function (done) {
    testmap2.saveDataToLocalStorage();
    done();
  });
  it('deletes an area', function (done) {
    testmap2.deleteAreas(testmap2.getSelectedAreas()[0], true);
    done();
  });
  it('loads areas from localStorage', function (done) {
    testmap2.loadDataFromLocalStorage();
    done();
  });
  it('imports an area with same id', function (done) {
    testmap2.importGeoJson(geo2);
    testmap2.groupAreasByProperty('id');
    done();
  });
  it('loads again from localStorage', function (done) {
    testmap2.loadDataFromLocalStorage();
    done();
  });
  it('adds a marker', function (done) {
    testmap1.addMarker(27.216284488869114,58.26829064495879, {"siin": "on üks rida", "siin2": "on teine rida"});
    done();
  })
});