// var expect = chai.expect;
var assert = chai.assert;

describe("Map", function () {
  describe("Area", function () {
    it("must exist on the map after importing", function (done) {
      this.timeout(2000);
      setTimeout(function () {
        assert.equal(Object.keys(maps._allAreas).length, Object.keys(geo).length, "is equal");
      }, 2000);
      done();
    });

    it("must have 'name' property of 'Test field' after editing metadata", function (done) {
      this.timeout(3000);
      setTimeout(function () {
        assert.equal(maps._allAreas.features[0]["properties"]["name"], "Test field", "is equal");
      }, 3000);
      done();
    });

    it("get image URL of the area", function (done) {
      this.timeout(3000);
      setTimeout(function () {
        maps._map.data.forEach(function (feature) {
          console.log(maps.getScreenshot(feature));
          assert.equal(maps.getScreenshot(feature) !== "", true, "is equal");
        }, 3000);
      });
      done();
    });

    it("should be deleted from the map", function (done) {
      this.timeout(4000);
      setTimeout(function () {
        maps.deleteAreas(444, true);
      }, 4000);

      assert.equal(Object.keys(maps._allAreas).length, 0, "is equal");
      done();
    });
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